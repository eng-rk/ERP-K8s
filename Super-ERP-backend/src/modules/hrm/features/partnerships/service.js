const Partnership = require('../../../../models/Partnership');
const BenefitSuggestion = require('../../../../models/BenefitSuggestion');

const createPartnership = (payload, userId) => Partnership.create({ ...payload, createdBy: userId });
const getPartnerships = () => Partnership.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
const createSuggestion = (payload, userId) => BenefitSuggestion.create({ ...payload, submittedBy: userId });
const getSuggestions = () => BenefitSuggestion.find().populate('submittedBy', 'name email').populate('reviewedBy', 'name email').sort({ createdAt: -1 });
const updateSuggestionStatus = async (id, status, userId) => {
  const suggestion = await BenefitSuggestion.findByIdAndUpdate(
    id,
    { status, reviewedBy: userId, reviewedAt: new Date() },
    { new: true, runValidators: true }
  );
  if (!suggestion) throw Object.assign(new Error('Benefit suggestion not found'), { statusCode: 404 });
  return suggestion;
};
module.exports = { createPartnership, getPartnerships, createSuggestion, getSuggestions, updateSuggestionStatus };
