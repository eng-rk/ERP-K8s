const express = require('express');
const router = express.Router();
const { getSystemAnalytics, getMarketingPerformance } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');

router.get('/', protect, checkPermission('iam.audit.view'), getSystemAnalytics);
router.get('/marketing-performance', protect, checkPermission('marketing.campaigns.view'), getMarketingPerformance);

module.exports = router;
