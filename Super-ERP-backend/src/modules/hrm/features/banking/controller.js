const service = require('./service');
const send = (res, status, data) => res.status(status).json({ success: true, data });
const fail = (res, error) => res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Internal server error' });

module.exports = {
  getMine: async (req, res) => { try { return send(res, 200, await service.getForEmployee(req.user._id)); } catch (e) { return fail(res, e); } },
  getEmployee: async (req, res) => { try { return send(res, 200, await service.getForEmployee(req.params.employeeId)); } catch (e) { return fail(res, e); } },
  upsert: async (req, res) => { try { return send(res, 200, await service.upsert(req.params.employeeId, req.body, req.user._id)); } catch (e) { return fail(res, e); } },
  verify: async (req, res) => { try { return send(res, 200, await service.verify(req.params.employeeId, req.user._id)); } catch (e) { return fail(res, e); } },
  remove: async (req, res) => { try { return send(res, 200, await service.remove(req.params.employeeId)); } catch (e) { return fail(res, e); } },
};
