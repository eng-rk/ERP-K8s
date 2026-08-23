const express = require('express');
const controller = require('./controller');
const { checkPermission } = require('../../../middleware/authorize');

const router = express.Router();

router.get('/', checkPermission('hrm.staff.view_list'), controller.list);
router.get('/:id', checkPermission('hrm.staff.view_list'), controller.getById);
router.post('/', checkPermission('hrm.staff.create'), controller.create);
router.patch('/:id', checkPermission('hrm.staff.edit_profile'), controller.update);

module.exports = router;
