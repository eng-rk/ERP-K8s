const Campaign = require('./model');

const updateExpiredCampaigns = async () => {
  const now = new Date();
  const result = await Campaign.updateMany(
    { status: 'Active', endDate: { $lt: now } },
    { $set: { status: 'Completed' } }
  );
  return result;
};

module.exports = { updateExpiredCampaigns };
