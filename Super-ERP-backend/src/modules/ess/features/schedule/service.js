const PayrollEntry = require('../../../../models/PayrollEntry');
const AuxSchedule = require('../../../../models/AuxSchedule');
const User = require('../../../../models/User');
const AuxLog = require('../../../../models/AuxLog');

exports.getMySchedule = async ({ employeeId, month }) => {
  const profile = await User.findById(employeeId).select('firstName lastName role department shift weeklyOffDays auxStatus');
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const logs = await AuxLog.find({ userId: employeeId, startedAt: { $gte: todayStart } }).sort({ startedAt: 1 });
  const todayStats = { Live: 0, Break: 0, Training: 0, Coaching: 0, 'Logged out': 0 };
  let activeStatusSince = null;
  logs.forEach(log => {
    if (log.endedAt === null) activeStatusSince = log.startedAt;
    const minutes = log.durationMinutes ?? Math.round((Date.now() - log.startedAt) / 60000);
    todayStats[log.status] = (todayStats[log.status] || 0) + minutes;
  });
  const query = { userId: employeeId };
  if (month) query.month = month;
  const schedules = await AuxSchedule.find(query).populate('userId', 'firstName lastName role department shift weeklyOffDays').sort({ month: -1 });
  return { profile, auxStatus: profile?.auxStatus || 'Logged out', activeStatusSince, todayStats, schedules };
};
