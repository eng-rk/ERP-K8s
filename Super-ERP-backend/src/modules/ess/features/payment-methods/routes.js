const express = require('express');
const { protect, enforceSelfScope } = require('../../../../middleware/auth');
const controller = require('../../../../controllers/paymentMethodController');

const router = express.Router();
const self = [protect, enforceSelfScope];

router.get('/payment-methods', self, controller.getMyPaymentMethods);
router.post('/payment-methods', self, controller.submitPaymentMethod);
router.put('/payment-methods/:id', self, controller.updatePaymentMethod);
router.delete('/payment-methods/:id', self, controller.deletePaymentMethod);

module.exports = router;
