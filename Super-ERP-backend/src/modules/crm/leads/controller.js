const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const User = require('../../../models/User');
const { expandScope } = require('../../../services/scopeResolver');

const ADMIN_ROLES = ['Super CRM Administrator', 'System Architect'];
const MANAGER_ROLES = ['Sales Manager'];

const assignRoundRobin = async (agentIds) => {
  if (!agentIds.length) return null;
  const counts = await Promise.all(agentIds.map(async (id) => ({ id, count: await Lead.countDocuments({ assignedTo: id }) })));
  counts.sort((a, b) => a.count - b.count);
  return counts[0].id;
};

exports.getLeadDistribution = async (req, res) => {
  try {
    let agents;
    if (ADMIN_ROLES.includes(req.user.role)) {
      agents = await User.find({ role: 'Sales Agent', isActive: true }).select('firstName lastName email');
    } else if (MANAGER_ROLES.includes(req.user.role)) {
      agents = await User.find({ supervisor: req.user._id, role: 'Sales Agent', isActive: true }).select('firstName lastName email');
    } else return res.status(403).json({ message: 'Not authorized' });

    const distribution = await Promise.all(agents.map(async (agent) => {
      const leadCount = await Lead.countDocuments({ assignedTo: agent._id });
      const statusBreakdown = await Lead.aggregate([
        { $match: { assignedTo: agent._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      return {
        agent: { _id: agent._id, name: `${agent.firstName} ${agent.lastName}`, email: agent.email },
        totalLeads: leadCount,
        statusBreakdown: statusBreakdown.reduce((acc, curr) => { acc[curr._id] = curr.count; return acc; }, {})
      };
    }));

    const leadCounts = distribution.map(d => d.totalLeads);
    const avgLeads = leadCounts.length ? Math.round(leadCounts.reduce((a, b) => a + b, 0) / leadCounts.length) : 0;
    const minLeads = leadCounts.length ? Math.min(...leadCounts) : 0;
    const maxLeads = leadCounts.length ? Math.max(...leadCounts) : 0;
    const variance = maxLeads - minLeads;
    res.json({ success: true, data: { distribution: distribution.sort((a, b) => b.totalLeads - a.totalLeads), stats: { totalAgents: agents.length, averageLeadsPerAgent: avgLeads, minLeads, maxLeads, variance, isBalanced: variance <= 2 } } });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

exports.getLeads = async (req, res) => {
  try {
    let leads;
    const scope = req.permissionScope || (ADMIN_ROLES.includes(req.user.role) ? 'GLOBAL' : 'SELF');
    if (scope === 'GLOBAL' || ADMIN_ROLES.includes(req.user.role)) {
      leads = await Lead.find()
        .populate({ path: 'assignedTo', select: 'firstName lastName email role supervisor', populate: { path: 'supervisor', select: 'firstName lastName' } })
        .populate('campaign', 'name platform').sort({ createdAt: -1 });
    } else if (scope === 'DEPARTMENT' || scope === 'TEAM' || MANAGER_ROLES.includes(req.user.role)) {
      const teamAgents = await User.find({ supervisor: req.user._id }).select('_id');
      const agentIds = teamAgents.map(a => a._id); agentIds.push(req.user._id);
      leads = await Lead.find({ assignedTo: { $in: agentIds } })
        .populate({ path: 'assignedTo', select: 'firstName lastName email role' })
        .populate('campaign', 'name platform').sort({ createdAt: -1 });
    } else {
      const { predicate } = expandScope('SELF', req.user);
      leads = await Lead.find({ assignedTo: predicate.employeeId || req.user._id }).populate('campaign', 'name platform').sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

exports.getLeadById = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id)
      .populate({ path: 'assignedTo', select: 'firstName lastName email role supervisor', populate: { path: 'supervisor', select: 'firstName lastName' } })
      .populate('campaign', 'name platform');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    const isAdmin = ADMIN_ROLES.includes(req.user.role), isManager = MANAGER_ROLES.includes(req.user.role), isAgent = req.user.role === 'Sales Agent';
    if (isAdmin || isManager || isAgent) {
      if (isAgent && lead.assignedTo?.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized to view this lead' });
      return res.status(200).json({ success: true, data: lead });
    }
    return res.status(403).json({ message: 'Not authorized to view leads' });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

exports.createLead = async (req, res) => {
  try {
    let assignedTo = req.body.assignedTo || null;
    if (!assignedTo) {
      let agentPool;
      if (ADMIN_ROLES.includes(req.user.role)) {
        const agents = await User.find({ role: 'Sales Agent', isActive: true }).select('_id'); agentPool = agents.map(a => a._id);
      } else if (MANAGER_ROLES.includes(req.user.role)) {
        const agents = await User.find({ supervisor: req.user._id, role: 'Sales Agent', isActive: true }).select('_id'); agentPool = agents.map(a => a._id);
      }
      if (agentPool?.length) assignedTo = await assignRoundRobin(agentPool);
    }
    const lead = await Lead.create({ ...req.body, assignedTo });
    const populated = await lead.populate({ path: 'assignedTo', select: 'firstName lastName email role' });
    res.status(201).json({ success: true, data: populated });
  } catch (error) { res.status(400).json({ message: 'Failed to create lead', error: error.message }); }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (ADMIN_ROLES.includes(req.user.role)) {
      const payload = { ...req.body }; if (payload.assignedTo === '') payload.assignedTo = null;
      const updated = await Lead.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
        .populate({ path: 'assignedTo', select: 'firstName lastName email role supervisor', populate: { path: 'supervisor', select: 'firstName lastName' } });
      return res.status(200).json({ success: true, data: updated });
    }
    if (MANAGER_ROLES.includes(req.user.role)) {
      const teamAgents = await User.find({ supervisor: req.user._id, role: 'Sales Agent' }).select('_id');
      const agentIds = teamAgents.map(a => a._id.toString());
      if (lead.assignedTo && !agentIds.includes(lead.assignedTo.toString())) return res.status(403).json({ message: 'This lead does not belong to your team' });
      if (req.body.assignedTo && req.body.assignedTo !== '' && !agentIds.includes(req.body.assignedTo)) return res.status(403).json({ message: 'You can only reassign within your team' });
      const allowed = { status: req.body.status, assignedTo: req.body.assignedTo === '' ? null : req.body.assignedTo };
      Object.keys(allowed).forEach(k => allowed[k] === undefined && delete allowed[k]);
      const updated = await Lead.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true }).populate({ path: 'assignedTo', select: 'firstName lastName email role' });
      return res.status(200).json({ success: true, data: updated });
    }
    if (req.user.role === 'Sales Agent') {
      if (lead.assignedTo?.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized to edit this lead' });
      const updated = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
      return res.status(200).json({ success: true, data: updated });
    }
    return res.status(403).json({ message: 'Not authorized' });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

exports.addLeadNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) return res.status(400).json({ message: 'Note text is required' });
    const objectId = new mongoose.Types.ObjectId(req.params.id), collection = Lead.collection;
    const leadExists = await collection.findOne({ _id: objectId }, { projection: { _id: 1 } });
    if (!leadExists) return res.status(404).json({ message: 'Lead not found' });
    const userRole = req.user?.role, isAdmin = ADMIN_ROLES.includes(userRole), isManager = MANAGER_ROLES.includes(userRole), isAgent = userRole === 'Sales Agent';
    if (!isAdmin && !isManager && !isAgent) return res.status(403).json({ message: 'Not authorized to add notes to this lead' });
    if (isAgent) {
      const lead = await Lead.findById(req.params.id).select('assignedTo');
      if (lead?.assignedTo?.toString() !== req.user?._id?.toString()) return res.status(403).json({ message: 'Not authorized to add notes to this lead' });
    }
    const noteDoc = { text: String(text).trim(), createdAt: new Date(), createdBy: { name: `${req.user?.firstName || 'User'} ${req.user?.lastName || ''}`.trim(), email: req.user?.email || '', role: userRole || 'User' } };
    const candidate = await collection.findOne({ _id: objectId }, { projection: { notes: 1 } });
    if (candidate && !Array.isArray(candidate.notes)) await collection.updateOne({ _id: objectId }, { $set: { notes: [] } });
    const pushResult = await collection.updateOne({ _id: objectId }, { $push: { notes: noteDoc } });
    if (!pushResult.matchedCount) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json({ success: true, message: 'Note added successfully', note: noteDoc });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error?.message || 'Unknown error' }); }
};

exports.getAssignableAgents = async (req, res) => {
  try {
    let agents;
    if (ADMIN_ROLES.includes(req.user.role)) agents = await User.find({ role: 'Sales Agent', isActive: true }).select('firstName lastName email supervisor').populate('supervisor', 'firstName lastName');
    else if (MANAGER_ROLES.includes(req.user.role)) agents = await User.find({ supervisor: req.user._id, role: 'Sales Agent', isActive: true }).select('firstName lastName email');
    else return res.status(403).json({ message: 'Not authorized' });
    res.json({ success: true, data: agents });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};
