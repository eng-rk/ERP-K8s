const mongoose = require('mongoose');
const Lead = require('./model');
const User = require('../../../models/User');
const { expandScope } = require('../../../services/scopeResolver');
const { assignRoundRobin } = require('./service');

const ADMIN_ROLES = ['Super CRM Administrator', 'System Architect'];
const MANAGER_ROLES = ['Sales Manager'];

exports.getLeadDistribution = async (req, res) => {
  try {
    let agents;
    if (ADMIN_ROLES.includes(req.user.role)) agents = await User.find({ role: 'Sales Agent', isActive: true }).select('firstName lastName email');
    else if (MANAGER_ROLES.includes(req.user.role)) agents = await User.find({ supervisor: req.user._id, role: 'Sales Agent', isActive: true }).select('firstName lastName email');
    else return res.status(403).json({ message: 'Not authorized' });
    const distribution = await Promise.all(agents.map(async (agent) => {
      const totalLeads = await Lead.countDocuments({ assignedTo: agent._id });
      const statusBreakdown = await Lead.aggregate([{ $match: { assignedTo: agent._id } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
      return { agent: { _id: agent._id, name: `${agent.firstName} ${agent.lastName}`, email: agent.email }, totalLeads, statusBreakdown: statusBreakdown.reduce((a, c) => { a[c._id] = c.count; return a; }, {}) };
    }));
    const counts = distribution.map(d => d.totalLeads), avg = counts.length ? Math.round(counts.reduce((a,b)=>a+b,0)/counts.length) : 0, min = counts.length ? Math.min(...counts) : 0, max = counts.length ? Math.max(...counts) : 0;
    res.json({ success: true, data: { distribution: distribution.sort((a,b)=>b.totalLeads-a.totalLeads), stats: { totalAgents: agents.length, averageLeadsPerAgent: avg, minLeads: min, maxLeads: max, variance: max-min, isBalanced: max-min <= 2 } } });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

exports.getLeads = async (req, res) => {
  try {
    const scope = req.permissionScope || (ADMIN_ROLES.includes(req.user.role) ? 'GLOBAL' : 'SELF');
    let leads;
    if (scope === 'GLOBAL' || ADMIN_ROLES.includes(req.user.role)) leads = await Lead.find().populate({ path:'assignedTo', select:'firstName lastName email role supervisor', populate:{path:'supervisor',select:'firstName lastName'} }).populate('campaign','name platform').sort({createdAt:-1});
    else if (scope === 'DEPARTMENT' || scope === 'TEAM' || MANAGER_ROLES.includes(req.user.role)) { const team = await User.find({supervisor:req.user._id}).select('_id'); const ids = team.map(a=>a._id); ids.push(req.user._id); leads = await Lead.find({assignedTo:{$in:ids}}).populate({path:'assignedTo',select:'firstName lastName email role'}).populate('campaign','name platform').sort({createdAt:-1}); }
    else { const { predicate } = expandScope('SELF', req.user); leads = await Lead.find({assignedTo:predicate.employeeId || req.user._id}).populate('campaign','name platform').sort({createdAt:-1}); }
    res.json({success:true,count:leads.length,data:leads});
  } catch(error){ res.status(500).json({message:'Server Error',error:error.message}); }
};

exports.getLeadById = async (req,res) => { try { const lead=await Lead.findById(req.params.id).populate({path:'assignedTo',select:'firstName lastName email role supervisor',populate:{path:'supervisor',select:'firstName lastName'}}).populate('campaign','name platform'); if(!lead)return res.status(404).json({message:'Lead not found'}); const admin=ADMIN_ROLES.includes(req.user.role),manager=MANAGER_ROLES.includes(req.user.role),agent=req.user.role==='Sales Agent'; if(agent&&lead.assignedTo?.toString()!==req.user._id.toString())return res.status(403).json({message:'Not authorized to view this lead'}); if(!admin&&!manager&&!agent)return res.status(403).json({message:'Not authorized to view leads'}); res.json({success:true,data:lead}); }catch(error){res.status(500).json({message:'Server Error',error:error.message});} };

exports.createLead = async (req,res) => { try { let assignedTo=req.body.assignedTo||null; if(!assignedTo){let agents=[]; if(ADMIN_ROLES.includes(req.user.role))agents=await User.find({role:'Sales Agent',isActive:true}).select('_id'); else if(MANAGER_ROLES.includes(req.user.role))agents=await User.find({supervisor:req.user._id,role:'Sales Agent',isActive:true}).select('_id'); if(agents.length)assignedTo=await assignRoundRobin(agents.map(a=>a._id));} const lead=await Lead.create({...req.body,assignedTo}); res.status(201).json({success:true,data:await lead.populate({path:'assignedTo',select:'firstName lastName email role'})}); }catch(error){res.status(400).json({message:'Failed to create lead',error:error.message});} };

exports.updateLead = async (req,res) => { try { const lead=await Lead.findById(req.params.id); if(!lead)return res.status(404).json({message:'Lead not found'}); if(ADMIN_ROLES.includes(req.user.role)){const payload={...req.body};if(payload.assignedTo==='')payload.assignedTo=null;const updated=await Lead.findByIdAndUpdate(req.params.id,payload,{new:true,runValidators:true}).populate({path:'assignedTo',select:'firstName lastName email role supervisor',populate:{path:'supervisor',select:'firstName lastName'}});return res.json({success:true,data:updated});} if(MANAGER_ROLES.includes(req.user.role)){const team=await User.find({supervisor:req.user._id,role:'Sales Agent'}).select('_id'),ids=team.map(a=>a._id.toString());if(lead.assignedTo&&!ids.includes(lead.assignedTo.toString()))return res.status(403).json({message:'This lead does not belong to your team'});if(req.body.assignedTo&&req.body.assignedTo!==''&&!ids.includes(req.body.assignedTo))return res.status(403).json({message:'You can only reassign within your team'});const allowed={status:req.body.status,assignedTo:req.body.assignedTo===''?null:req.body.assignedTo};Object.keys(allowed).forEach(k=>allowed[k]===undefined&&delete allowed[k]);const updated=await Lead.findByIdAndUpdate(req.params.id,allowed,{new:true,runValidators:true}).populate({path:'assignedTo',select:'firstName lastName email role'});return res.json({success:true,data:updated});} if(req.user.role==='Sales Agent'){if(lead.assignedTo?.toString()!==req.user._id.toString())return res.status(403).json({message:'Not authorized to edit this lead'});return res.json({success:true,data:await Lead.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true})});} return res.status(403).json({message:'Not authorized'}); }catch(error){res.status(500).json({message:'Server Error',error:error.message});} };

exports.addLeadNote = async (req,res) => { try {const text=String(req.body.text||'').trim();if(!text)return res.status(400).json({message:'Note text is required'});const objectId=new mongoose.Types.ObjectId(req.params.id),lead=await Lead.findById(req.params.id).select('assignedTo');if(!lead)return res.status(404).json({message:'Lead not found'});const role=req.user.role,admin=ADMIN_ROLES.includes(role),manager=MANAGER_ROLES.includes(role),agent=role==='Sales Agent';if(!admin&&!manager&&!agent)return res.status(403).json({message:'Not authorized to add notes to this lead'});if(agent&&lead.assignedTo?.toString()!==req.user._id.toString())return res.status(403).json({message:'Not authorized to add notes to this lead'});const note={text,createdAt:new Date(),createdBy:{name:`${req.user.firstName||'User'} ${req.user.lastName||''}`.trim(),email:req.user.email||'',role:role||'User'}};await Lead.collection.updateOne({_id:objectId},{$push:{notes:note}});res.json({success:true,message:'Note added successfully',note});}catch(error){res.status(500).json({message:'Server Error',error:error.message});} };

exports.getAssignableAgents = async (req,res) => { try {let agents;if(ADMIN_ROLES.includes(req.user.role))agents=await User.find({role:'Sales Agent',isActive:true}).select('firstName lastName email supervisor').populate('supervisor','firstName lastName');else if(MANAGER_ROLES.includes(req.user.role))agents=await User.find({supervisor:req.user._id,role:'Sales Agent',isActive:true}).select('firstName lastName email');else return res.status(403).json({message:'Not authorized'});res.json({success:true,data:agents});}catch(error){res.status(500).json({message:'Server Error',error:error.message});} };
