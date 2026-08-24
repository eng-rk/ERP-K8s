const service = require('./service');
const { validateJournal } = require('./validation');
const fail = (res, err) => res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });

async function createAccount(req, res) { try { return res.status(201).json({ success: true, data: await service.createAccount(req.body) }); } catch (e) { return fail(res, e); } }
async function listAccounts(req, res) { try { return res.json({ success: true, data: await service.listAccounts(req.query) }); } catch (e) { return fail(res, e); } }
async function createCostCenter(req, res) { try { return res.status(201).json({ success: true, data: await service.createCostCenter(req.body) }); } catch (e) { return fail(res, e); } }
async function listCostCenters(req, res) { try { return res.json({ success: true, data: await service.listCostCenters(req.query) }); } catch (e) { return fail(res, e); } }
async function createJournal(req, res) { const errors = validateJournal(req.body); if (errors.length) return res.status(400).json({ success: false, errors }); try { return res.status(201).json({ success: true, data: await service.createJournal(req.body, req.user?._id) }); } catch (e) { return fail(res, e); } }
async function listJournals(req, res) { try { return res.json({ success: true, data: await service.listJournals(req.query, req.query) }); } catch (e) { return fail(res, e); } }
module.exports = { createAccount, listAccounts, createCostCenter, listCostCenters, createJournal, listJournals };
