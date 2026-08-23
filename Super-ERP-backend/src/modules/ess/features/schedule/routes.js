const express = require('express');
const { protect, enforceSelfScope } = require('../../../../middleware/auth');
const controller = require('./controller');
const router = express.Router();
router.get('/schedule', protect, enforceSelfScope, controller.getMySchedule);
module.exports = router;
