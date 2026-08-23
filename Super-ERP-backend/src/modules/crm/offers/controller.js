const legacy = require('../../../controllers/offerController');
const { validateOfferInput } = require('./validation');

function createOffer(req, res, next) {
  const errors = validateOfferInput(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });
  return legacy.createOffer(req, res, next);
}

function updateOffer(req, res, next) {
  const errors = validateOfferInput(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ success: false, errors });
  return legacy.updateOffer(req, res, next);
}

module.exports = { ...legacy, createOffer, updateOffer };
