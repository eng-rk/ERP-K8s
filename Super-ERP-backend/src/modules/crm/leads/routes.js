const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { protect } = require('../../../middleware/auth');
const { checkPermission } = require('../../../middleware/authorize');

router.get('/', protect, checkPermission('crm.leads.view'), controller.getLeads);
router.get('/distribution', protect, checkPermission('crm.leads.view'), controller.getLeadDistribution);
router.get('/agents', protect, checkPermission('crm.leads.view'), controller.getAssignableAgents);
router.get('/:id', protect, checkPermission('crm.leads.view'), controller.getLeadById);
router.post('/', protect, checkPermission('crm.leads.create'), controller.createLead);
router.put('/:id', protect, checkPermission('crm.leads.edit'), controller.updateLead);
router.post('/:id/notes', protect, checkPermission('crm.leads.edit'), controller.addLeadNote);

module.exports = router;
