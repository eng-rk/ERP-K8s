const express = require('express');
const { protect, enforceSelfScope } = require('../../../../middleware/auth');
const controller = require('./controller');
const router = express.Router();
router.get('/payment-methods', protect, enforceSelfScope, controller.getMyPaymentMethods);
router.post('/payment-methods', protect, enforceSelfScope, controller.submitPaymentMethod);
router.put('/payment-methods/:id', protect, enforceSelfScope, controller.updatePaymentMethod);
router.delete('/payment-methods/:id', protect, enforceSelfScope, controller.deletePaymentMethod);
module.exports = router;
