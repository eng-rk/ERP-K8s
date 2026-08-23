const emailService = require('./email.service');

const handle = (fn) => async (req, res) => {
  try {
    const data = await fn(req);
    return res.json({ success: true, data, ...(data?.unreadCount !== undefined ? { unreadCount: data.unreadCount } : {}) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

exports.sendEmail = handle(async (req) => emailService.sendEmail({
  senderId: req.user._id,
  ...req.body,
}));

exports.getInbox = handle(async (req) => {
  const data = await emailService.getInbox(req.user._id);
  return { emails: data, unreadCount: data.filter((email) => !email.isRead).length };
});

exports.getSent = handle(async (req) => emailService.getSent(req.user._id));
exports.getEmailThread = handle(async (req) => emailService.getThread(req.params.id));

exports.markEmailRead = handle(async (req) => {
  const data = await emailService.markRead(req.params.id, req.user._id);
  if (!data) {
    const error = new Error('Email not found');
    error.statusCode = 404;
    throw error;
  }
  return data;
});
