const service = require('./service');

const send = (res, status, data) => res.status(status).json({ success: true, data });
const fail = (res, error) => res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Internal server error' });

module.exports = {
  createVacancy: async (req, res) => { try { return send(res, 201, await service.createVacancy(req.body)); } catch (e) { return fail(res, e); } },
  getVacancies: async (req, res) => { try { return send(res, 200, await service.getVacancies(req.query)); } catch (e) { return fail(res, e); } },
  createCandidate: async (req, res) => { try { return send(res, 201, await service.createCandidate(req.body)); } catch (e) { return fail(res, e); } },
  getCandidates: async (req, res) => { try { return send(res, 200, await service.getCandidates(req.query)); } catch (e) { return fail(res, e); } },
  updateCandidateStatus: async (req, res) => { try { return send(res, 200, await service.updateCandidateStatus(req.params.id, req.body.status)); } catch (e) { return fail(res, e); } },
  addCandidateFeedback: async (req, res) => { try { return send(res, 200, await service.addCandidateFeedback(req.params.id, req.body.note || req.body.feedback, req.user?._id)); } catch (e) { return fail(res, e); } },
};
