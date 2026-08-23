const service = require('./service');
const respondError = (res, error) => res.status(error.status || 500).json({ message: error.message || 'Server error' });
exports.createTraining = async (req, res) => { try { const data = await service.createTraining(req.body); res.status(201).json({ success: true, data }); } catch (error) { respondError(res, error); } };
exports.getTrainings = async (req, res) => { try { const data = await service.getTrainings({ employeeId: req.query.employeeId }); res.json({ success: true, data }); } catch (error) { respondError(res, error); } };
exports.updateTrainingReport = async (req, res) => { try { const data = await service.updateTrainingReport({ id: req.params.id, ...req.body }); res.json({ success: true, data }); } catch (error) { respondError(res, error); } };
