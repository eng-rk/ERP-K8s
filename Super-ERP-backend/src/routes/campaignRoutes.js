const express = require('express');
const router = express.Router();
const { getCampaigns, createCampaign, updateCampaign, deleteCampaign } = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');

router.get('/', protect, checkPermission('marketing.campaigns.view'), getCampaigns);
router.post('/', protect, checkPermission('marketing.campaigns.create'), createCampaign);
router.put('/:id', protect, checkPermission('marketing.campaigns.create'), updateCampaign);
router.delete('/:id', protect, checkPermission('marketing.campaigns.create'), deleteCampaign);

module.exports = router;
