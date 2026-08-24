const Candidate = require('../../../../models/Candidate');
const JobVacancy = require('../../../../models/JobVacancy');

const createVacancy = (payload) => JobVacancy.create(payload);
const getVacancies = (query = {}) => JobVacancy.find(query).sort({ createdAt: -1 });

const createCandidate = (payload) => Candidate.create(payload);
const getCandidates = (query = {}) => Candidate.find(query)
  .populate('vacancyId', 'title status')
  .populate('interviewerNotes.addedBy', 'name email')
  .sort({ createdAt: -1 });

const updateCandidateStatus = async (id, status) => {
  const candidate = await Candidate.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!candidate) throw Object.assign(new Error('Candidate not found'), { statusCode: 404 });
  return candidate;
};

const addCandidateFeedback = async (id, note, userId) => {
  if (!note || !String(note).trim()) throw Object.assign(new Error('Feedback note is required'), { statusCode: 400 });
  const candidate = await Candidate.findByIdAndUpdate(
    id,
    { $push: { interviewerNotes: { note: String(note).trim(), addedBy: userId } } },
    { new: true, runValidators: true }
  );
  if (!candidate) throw Object.assign(new Error('Candidate not found'), { statusCode: 404 });
  return candidate;
};

module.exports = { createVacancy, getVacancies, createCandidate, getCandidates, updateCandidateStatus, addCandidateFeedback };
