const express = require('express');
const router = express.Router();
const { getOffersByLead, createOffer, updateOffer, deleteOffer, sendOffer, getTemplates, createTemplate, updateTemplate, deleteTemplate, uploadOfferImage, deleteOfferImage, initiateAvayaCall, getOfferByLocator, getOfferCommunicationLog, addOfferCommunicationReply, getOfferById } = require('../controllers/offerController');
const { applyDiscount } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');
const upload = require('../middleware/upload');
const uploadAttachment = require('../middleware/uploadAttachment');

router.get('/lead/:leadId', protect, checkPermission('crm.offers.view'), getOffersByLead);
router.get('/locator/:recordLocator', protect, checkPermission('crm.offers.view'), getOfferByLocator);
router.get('/:id', protect, checkPermission('crm.offers.view'), getOfferById);
router.post('/', protect, checkPermission('crm.offers.create'), createOffer);
router.put('/:id', protect, checkPermission('crm.offers.edit'), updateOffer);
router.delete('/:id', protect, checkPermission('crm.offers.void'), deleteOffer);
router.post('/:id/send', protect, uploadAttachment.array('attachments'), checkPermission('crm.offers.send_email'), sendOffer);
router.post('/:id/images', protect, upload.single('image'), checkPermission('crm.offers.edit'), uploadOfferImage);
router.delete('/:id/images/:imageId', protect, checkPermission('crm.offers.edit'), deleteOfferImage);
router.get('/:id/communications', protect, checkPermission('crm.offers.view'), getOfferCommunicationLog);
router.post('/:id/communications/reply', protect, checkPermission('crm.offers.edit'), addOfferCommunicationReply);
router.post('/:id/call', protect, checkPermission('crm.offers.edit'), initiateAvayaCall);
router.post('/:id/discount', protect, checkPermission('crm.offers.apply_standard_discount'), applyDiscount);

// Template routes
router.get('/templates', protect, checkPermission('crm.offers.view'), getTemplates);
router.post('/templates', protect, checkPermission('crm.offers.create'), createTemplate);
router.put('/templates/:id', protect, checkPermission('crm.offers.edit'), updateTemplate);
router.delete('/templates/:id', protect, checkPermission('crm.offers.void'), deleteTemplate);

module.exports = router;
