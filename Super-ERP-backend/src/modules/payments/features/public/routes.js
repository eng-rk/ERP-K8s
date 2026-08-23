const express = require('express');
const controller = require('./controller');

const router = express.Router();
router.get('/:token', controller.getPublicOfferByToken);
router.post('/:token', controller.processPublicPayment);
module.exports = router;
