const express = require('express');
const router = express.Router();
const { getLeads, getLeadById, createLead, updateLead, addLeadNote, getAssignableAgents, getLeadDistribution } = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');

router.use(protect);

router.get('/agents', checkPermission('crm.leads.assign'), getAssignableAgents);
router.get('/distribution', checkPermission('crm.leads.view'), getLeadDistribution);
router.route('/')
  .get(checkPermission('crm.leads.view'), getLeads)
  .post(checkPermission('crm.leads.create'), createLead);

router.route('/:id')
  .get(checkPermission('crm.leads.view'), getLeadById)
  .put(checkPermission('crm.leads.edit'), updateLead);

router.post('/:id/notes', checkPermission('crm.leads.edit'), addLeadNote);

module.exports = router;
