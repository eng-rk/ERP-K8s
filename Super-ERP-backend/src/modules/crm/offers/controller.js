const legacy = require('../../../controllers/offerController');
const { normalizeCreatePayload, assertOwnerOrAdmin, assertDraftOrAdmin } = require('./service');
const Offer = require('./model');

async function createOffer(req, res, next) {
  try {
    req.body = { ...req.body, ...normalizeCreatePayload(req.body) };
    return legacy.createOffer(req, res, next);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
}

async function updateOffer(req, res, next) {
  try {
    const offer = await Offer.findById(req.params.id).select('createdBy status');
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    assertOwnerOrAdmin(offer, req.user);
    assertDraftOrAdmin(offer, req.user);
    return legacy.updateOffer(req, res, next);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
}

module.exports = {
  ...legacy,
  createOffer,
  updateOffer
};
