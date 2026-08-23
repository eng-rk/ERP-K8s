const emailService = require('./email.service');

const sendEmail = async (req, res) => {
  try {
    const data = await emailService.sendEmail({ senderId: req.user._id, ...req.body });
    res.status(201).json({ success: true, data });
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.message || 'Server error' }); }
};

const getInbox = async (req, res) => {
  try {
    const emails = await emailService.getInbox(req.user._id);
    res.json({ success: true, data: emails, unreadCount: emails.filter((email) => !email.isRead).length });
  } catch (error) { res.status(500).json({ message: error.message || 'Server error' }); }
};

const getSent = async (req, res) => {
  try { res.json({ success: true, data: await emailService.getSent(req.user._id) }); }
  catch (error) { res.status(500).json({ message: error.message || 'Server error' }); }
};

const getEmailThread = async (req, res) => {
  try { res.json({ success: true, data: await emailService.getThread(req.params.id) }); }
  catch (error) { res.status(500).json({ message: error.message || 'Server error' }); }
};

const markEmailRead = async (req, res) => {
  try {
    const data = await emailService.markRead(req.params.id, req.user._id);
    if (!data) return res.status(404).json({ message: 'Email not found' });
    return res.json({ success: true, data });
  } catch (error) { return res.status(500).json({ message: error.message || 'Server error' }); }
};

module.exports = { sendEmail, getInbox, getSent, getEmailThread, markEmailRead };
