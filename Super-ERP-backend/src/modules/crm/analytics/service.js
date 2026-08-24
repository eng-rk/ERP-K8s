const Lead = require('../../../models/Lead');
const Ticket = require('../../../models/Ticket');
const Campaign = require('../../../models/Campaign');
const User = require('../../../models/User');
const { updateExpiredCampaigns } = require('../../../services/campaignHelper');

const calcDelta = (current, previous) => previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;

async function getSystemAnalyticsData() {
  await updateExpiredCampaigns();
  const totalLeads = await Lead.countDocuments();
  const newLeads = await Lead.countDocuments({ status: 'New' });
  const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
  const totalTickets = await Ticket.countDocuments();
  const openTickets = await Ticket.countDocuments({ status: 'Open' });
  const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
  const totalCampaigns = await Campaign.countDocuments();
  const activeCampaigns = await Campaign.countDocuments({ status: 'Active' });
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const [prevTotalLeads, prevNewLeads, prevConvertedLeads, prevTotalTickets, prevOpenTickets] = await Promise.all([
    Lead.countDocuments({ createdAt: { $lt: oneMonthAgo } }),
    Lead.countDocuments({ status: 'New', createdAt: { $lt: oneMonthAgo } }),
    Lead.countDocuments({ status: 'Converted', createdAt: { $lt: oneMonthAgo } }),
    Ticket.countDocuments({ createdAt: { $lt: oneMonthAgo } }),
    Ticket.countDocuments({ status: 'Open', createdAt: { $lt: oneMonthAgo } })
  ]);
  const [leadsByPlatform, leadsByMonth, ticketsByMonth, teamMembers, roleDistribution] = await Promise.all([
    Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, campaign: { $exists: true, $ne: null } } },
      { $lookup: { from: 'campaigns', localField: 'campaign', foreignField: '_id', as: 'campaignInfo' } },
      { $unwind: '$campaignInfo' },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' }, platform: '$campaignInfo.platform', status: '$status' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    Lead.aggregate([{ $match: { createdAt: { $gte: sixMonthsAgo } } }, { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' }, source: '$source', status: '$status' }, count: { $sum: 1 } } }]),
    Ticket.aggregate([{ $match: { createdAt: { $gte: sixMonthsAgo } } }, { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' }, status: '$status' }, count: { $sum: 1 } } }]),
    User.find({ isActive: true }).select('firstName lastName role').lean(),
    User.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$role', count: { $sum: 1 } } }])
  ]);
  const teamPerformance = await Promise.all(teamMembers.map(async member => {
    const [leadsHandled, leadsConverted, ticketsResolved] = await Promise.all([
      Lead.countDocuments({ assignedTo: member._id }),
      Lead.countDocuments({ assignedTo: member._id, status: 'Converted' }),
      Ticket.countDocuments({ assignedTo: member._id, status: 'Resolved' })
    ]);
    const conversionRate = leadsHandled > 0 ? `${((leadsConverted / leadsHandled) * 100).toFixed(0)}%` : '—';
    const performance = leadsHandled > 0 || ticketsResolved > 0 ? Math.min(100, Math.round((leadsConverted * 10 + ticketsResolved * 3))) : 0;
    return { name: `${member.firstName} ${member.lastName}`, role: member.role, leads: leadsHandled, tickets: ticketsResolved, conversionRate, performance };
  }));
  return {
    leads: { total: totalLeads, new: newLeads, converted: convertedLeads, deltas: { total: calcDelta(totalLeads, prevTotalLeads), new: calcDelta(newLeads, prevNewLeads), converted: calcDelta(convertedLeads, prevConvertedLeads) } },
    tickets: { total: totalTickets, open: openTickets, resolved: resolvedTickets, deltas: { total: calcDelta(totalTickets, prevTotalTickets), open: calcDelta(openTickets, prevOpenTickets) } },
    campaigns: { total: totalCampaigns, active: activeCampaigns },
    leadsByPlatform, leadsByMonth, ticketsByMonth,
    teamPerformance: teamPerformance.filter(t => t.leads > 0 || t.tickets > 0).slice(0, 10),
    roleDistribution
  };
}

async function getMarketingPerformanceData() {
  const platformSources = { Google: ['Google', 'Google Ads'], Meta: ['Meta', 'Meta Ads'] };
  const performanceData = await Promise.all(Object.entries(platformSources).map(async ([platform, sources]) => {
    const totalLeads = await Lead.countDocuments({ source: { $in: sources } });
    const convertedLeads = await Lead.countDocuments({ source: { $in: sources }, status: { $in: ['Confirmed', 'Won', 'Converted'] } });
    return { platform, totalLeads, convertedLeads, conversionRate: totalLeads > 0 ? parseFloat(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0 };
  }));
  const sorted = [...performanceData].sort((a, b) => b.conversionRate - a.conversionRate || b.totalLeads - a.totalLeads);
  return { performanceData, winningPlatform: sorted[0]?.conversionRate > 0 ? sorted[0] : null, losingPlatform: sorted[0]?.conversionRate > 0 ? sorted[1] || null : null };
}

module.exports = { getSystemAnalyticsData, getMarketingPerformanceData };
