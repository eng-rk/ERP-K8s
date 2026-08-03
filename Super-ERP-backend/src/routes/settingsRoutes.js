const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');
const {
  getBusinessModel,
  updateBusinessModel,
  getEmailSettings,
  updateEmailSettings,
  testEmailSettings,
  getBrandingConfig,
  updateBrandingConfig,
  uploadBrandingLogo,
  getErpConfig,
  updateErpConfig,
  getTelephonyConfig,
  updateTelephonyConfig,
  getPricingSettings,
  updatePricingSettings,
  getCurrencies,
  updateCurrencies,
  deleteCurrency,
  getAuxSettings,
  updateAuxSettings,
} = require('../controllers/settingsController');
const uploadBranding = require('../middleware/uploadBranding');

router.get('/aux', protect, checkPermission('admin.settings.view'), getAuxSettings);
router.put('/aux', protect, checkPermission('admin.settings.update_business_model'), updateAuxSettings);

router.get('/business-model', protect, checkPermission('admin.settings.view'), getBusinessModel);
router.put('/business-model', protect, checkPermission('admin.settings.update_business_model'), updateBusinessModel);

router.get('/email', protect, checkPermission('admin.settings.view'), getEmailSettings);
router.put('/email', protect, checkPermission('admin.settings.update_smtp'), updateEmailSettings);
router.post('/email/test', protect, checkPermission('admin.settings.update_smtp'), testEmailSettings);

router.get('/branding', protect, checkPermission('admin.settings.view'), getBrandingConfig);
router.put('/branding', protect, checkPermission('admin.settings.update_business_model'), updateBrandingConfig);
router.post('/branding/logo', protect, uploadBranding.single('logo'), checkPermission('admin.settings.update_business_model'), uploadBrandingLogo);

router.get('/erp', protect, checkPermission('admin.settings.view'), getErpConfig);
router.put('/erp', protect, checkPermission('admin.settings.update_business_model'), updateErpConfig);
router.get('/telephony', protect, checkPermission('admin.settings.view'), getTelephonyConfig);
router.put('/telephony', protect, checkPermission('admin.settings.update_business_model'), updateTelephonyConfig);

router.get('/pricing', protect, checkPermission('admin.settings.view'), getPricingSettings);
router.put('/pricing', protect, checkPermission('admin.settings.update_business_model'), updatePricingSettings);

router.get('/currencies', protect, checkPermission('admin.settings.view'), getCurrencies);
router.put('/currencies', protect, checkPermission('admin.settings.update_business_model'), updateCurrencies);
router.delete('/currencies/:code', protect, checkPermission('admin.settings.update_business_model'), deleteCurrency);

module.exports = router;
