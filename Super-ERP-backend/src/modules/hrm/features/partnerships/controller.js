const service = require('./service');
const send = (res, status, data) => res.status(status).json({ success: true, data });
const fail = (res, error) => res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Internal server error' });

module.exports = {
  createPartnership: async (req, res) => { try { return send(res, 201, await service.createPartnership(req.body, req.user._id)); } catch (e) { return fail(res, e); } },
  getPartnerships: async (_req, res) => { try { return send(res, 200, await service.getPartnerships()); } catch (e) { return fail(res, e); } },
  createSuggestion: async (req, res) => { try { return send(res, 201, await service.createSuggestion(req.body, req.user._id)); } catch (e) { return fail(res, e); } },
  getSuggestions: async (_req, res) => { try { return send(res, 200, await service.getSuggestions()); } catch (e) { return fail(res, e); } },
  updateSuggestionStatus: async (req, res) => { try { return send(res, 200, await service.updateSuggestionStatus(req.params.id, req.body.status, req.user._id)); } catch (e) { return fail(res, e); } },
};
