const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { protect } = require('../../../middleware/auth');
const { checkPermission } = require('../../../middleware/authorize');

router.get('/', protect, checkPermission('marketing.campaigns.view'), controller.getCampaigns);
router.post('/', protect, checkPermission('marketing.campaigns.create'), controller.createCampaign);
router.put('/:id', protect, checkPermission('marketing.campaigns.create'), controller.updateCampaign);
router.delete('/:id', protect, checkPermission('marketing.campaigns.create'), controller.deleteCampaign);

module.exports = router;
