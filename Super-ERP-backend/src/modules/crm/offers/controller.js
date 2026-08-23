const legacy = require('../../../controllers/offerController');
const { validateOfferInput } = require('./validation');

function createOffer(req, res, next) {
  const errors = validateOfferInput(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });
  return legacy.createOffer(req, res, next);
}

function updateOffer(req, res, next) {
  const errors = validateOfferInput({ ...req.body, lead: req.body.lead || req.params.leadId || '000000000000000000000000' });
  const nonLeadErrors = errors.filter((error) => error !== 'lead must be a valid id');
  if (nonLeadErrors.length) return res.status(400).json({ success: false, errors: nonLeadErrors });
  return legacy.updateOffer(req, res, next);
}

module.exports = { ...legacy, createOffer, updateOffer };
