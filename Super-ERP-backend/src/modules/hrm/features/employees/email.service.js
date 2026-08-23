const User = require('../../../../models/User');
const Email = require('../../../../models/Email');

const sendEmail = async ({ senderId, recipientEmail, subject, body, parentId }) => {
  const recipient = await User.findOne({ email: recipientEmail });
  if (!recipient) {
    const error = new Error('Recipient not found');
    error.statusCode = 404;
    throw error;
  }

  const email = await Email.create({
    senderId,
    recipientId: recipient._id,
    subject,
    body,
    parentId: parentId || null,
    isReply: !!parentId,
  });

  await email.populate('senderId', 'firstName lastName email role');
  await email.populate('recipientId', 'firstName lastName email role');
  return email;
};

const getInbox = (userId) => Email.find({ recipientId: userId })
  .populate('senderId', 'firstName lastName email role')
  .populate('recipientId', 'firstName lastName email role')
  .sort({ sentAt: -1 });

const getSent = (userId) => Email.find({ senderId: userId })
  .populate('recipientId', 'firstName lastName email role')
  .populate('senderId', 'firstName lastName email role')
  .sort({ sentAt: -1 });

const getThread = async (id) => {
  const email = await Email.findById(id);
  const rootId = email?.parentId || id;
  return Email.find({ parentId: rootId })
    .populate('senderId', 'firstName lastName email role')
    .populate('recipientId', 'firstName lastName email role')
    .sort({ sentAt: 1 });
};

const markRead = (id, userId) => Email.findOneAndUpdate(
  { _id: id, recipientId: userId },
  { isRead: true, readAt: new Date() },
  { new: true }
);

module.exports = { sendEmail, getInbox, getSent, getThread, markRead };
