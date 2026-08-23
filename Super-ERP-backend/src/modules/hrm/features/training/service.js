const Training = require('../../../../models/Training');
const User = require('../../../../models/User');

async function createTraining({ employeeId, type, assignedTrainerId, topic, scheduledDate }) {
  return Training.create({ employeeId, type, assignedTrainerId, topic, scheduledDate });
}

async function getTrainings({ employeeId }) {
  const query = employeeId ? { employeeId } : {};
  return Training.find(query).populate('employeeId', 'firstName lastName email').populate('assignedTrainerId', 'firstName lastName email').sort({ scheduledDate: -1 });
}

async function updateTrainingReport({ id, report, status, score }) {
  const training = await Training.findById(id);
  if (!training) throw Object.assign(new Error('Training not found.'), { status: 404 });
  if (report !== undefined) training.report = report;
  if (status !== undefined) training.status = status;
  if (score !== undefined) training.score = score;
  await training.save();
  return training;
}

module.exports = { createTraining, getTrainings, updateTrainingReport };
