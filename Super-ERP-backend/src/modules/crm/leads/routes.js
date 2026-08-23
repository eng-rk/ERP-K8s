const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { protect } = require('../../../middleware/auth');
const { checkPermission } = require('../../../middleware/authorize');

router.use(protect);
router.get('/agents', checkPermission('crm.leads.assign'), controller.getAssignableAgents);
router.get('/distribution', checkPermission('crm.leads.view'), controller.getLeadDistribution);
router.route('/').get(checkPermission('crm.leads.view'), controller.getLeads).post(checkPermission('crm.leads.create'), controller.createLead);
router.route('/:id').get(checkPermission('crm.leads.view'), controller.getLeadById).put(checkPermission('crm.leads.edit'), controller.updateLead);
router.post('/:id/notes', checkPermission('crm.leads.edit'), controller.addLeadNote);

module.exports = router;
