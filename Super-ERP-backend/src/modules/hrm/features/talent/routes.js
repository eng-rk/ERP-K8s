const express = require('express');
const { protect } = require('../../../../middleware/auth');
const { checkPermission } = require('../../../../middleware/authorize');
const controller = require('./controller');

const router = express.Router();
router.post('/vacancies', protect, checkPermission('talent.ats.create_vacancy'), controller.createVacancy);
router.get('/vacancies', protect, checkPermission('talent.ats.view_vacancies'), controller.getVacancies);
router.post('/candidates', protect, checkPermission('talent.ats.create_vacancy'), controller.createCandidate);
router.get('/candidates', protect, checkPermission('talent.ats.view_vacancies'), controller.getCandidates);
router.put('/candidates/:id/status', protect, checkPermission('talent.ats.create_vacancy'), controller.updateCandidateStatus);
router.post('/candidates/:id/feedback', protect, checkPermission('talent.ats.add_feedback'), controller.addCandidateFeedback);
router.post('/candidates/:id/notes', protect, checkPermission('talent.ats.add_feedback'), controller.addCandidateFeedback);
module.exports = router;
