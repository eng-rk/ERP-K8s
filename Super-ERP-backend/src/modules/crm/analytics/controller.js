const { getSystemAnalyticsData, getMarketingPerformanceData } = require('./service');

exports.getSystemAnalytics = async (req, res) => {
  try { return res.status(200).json({ success: true, data: await getSystemAnalyticsData() }); }
  catch (error) { return res.status(500).json({ message: 'Server Error', error: error.message }); }
};

exports.getMarketingPerformance = async (req, res) => {
  try { return res.status(200).json({ success: true, data: await getMarketingPerformanceData() }); }
  catch (error) { return res.status(500).json({ message: 'Server Error', error: error.message }); }
};
