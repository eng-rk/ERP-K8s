const express = require('express');
const { protect } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/authorize');
const settings = require('../../controllers/settingsController');
const uploadBranding = require('../../middleware/uploadBranding');

const router = express.Router();
const view = checkPermission('admin.settings.view');
const update = checkPermission('admin.settings.update_business_model');

router.get('/aux', protect, view, settings.getAuxSettings);
router.put('/aux', protect, update, settings.updateAuxSettings);
router.get('/business-model', protect, view, settings.getBusinessModel);
router.put('/business-model', protect, update, settings.updateBusinessModel);
router.get('/email', protect, view, settings.getEmailSettings);
router.put('/email', protect, checkPermission('admin.settings.update_smtp'), settings.updateEmailSettings);
router.post('/email/test', protect, checkPermission('admin.settings.update_smtp'), settings.testEmailSettings);
router.get('/branding', protect, view, settings.getBrandingConfig);
router.put('/branding', protect, update, settings.updateBrandingConfig);
router.post('/branding/logo', protect, uploadBranding.single('logo'), update, settings.uploadBrandingLogo);
router.get('/erp', protect, view, settings.getErpConfig);
router.put('/erp', protect, update, settings.updateErpConfig);
router.get('/telephony', protect, view, settings.getTelephonyConfig);
router.put('/telephony', protect, update, settings.updateTelephonyConfig);
router.get('/pricing', protect, view, settings.getPricingSettings);
router.put('/pricing', protect, update, settings.updatePricingSettings);
router.get('/currencies', protect, view, settings.getCurrencies);
router.put('/currencies', protect, update, settings.updateCurrencies);
router.delete('/currencies/:code', protect, update, settings.deleteCurrency);

module.exports = router;
