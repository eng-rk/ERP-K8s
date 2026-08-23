const express = require('express');
const { protect, enforceSelfScope } = require('../../../../middleware/auth');
const { getMySchedule } = require('../../../../controllers/essController');

const router = express.Router();
const self = [protect, enforceSelfScope];

router.get('/schedule', self, getMySchedule);

module.exports = router;
