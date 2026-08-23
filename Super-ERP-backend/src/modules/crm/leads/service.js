const Lead = require('./model');

const assignRoundRobin = async (agentIds) => {
  if (!agentIds.length) return null;
  const counts = await Promise.all(agentIds.map(async (id) => ({
    id,
    count: await Lead.countDocuments({ assignedTo: id }),
  })));
  counts.sort((a, b) => a.count - b.count);
  return counts[0].id;
};

module.exports = { assignRoundRobin };
