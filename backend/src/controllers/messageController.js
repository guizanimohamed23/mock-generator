const Message = require('../models/Message');
const { asyncHandler } = require('../utils/asyncHandler');

const listInbox = asyncHandler(async (req, res) => {
  const messages = await Message.find({ to: req.user.id })
    .sort({ createdAt: -1 })
    .populate('from', 'name email role')
    .lean();
  res.json(messages);
});

const listSent = asyncHandler(async (req, res) => {
  const messages = await Message.find({ from: req.user.id })
    .sort({ createdAt: -1 })
    .populate('to', 'name email role')
    .lean();
  res.json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { to, text } = req.body;
  if (!to || !text) return res.status(400).json({ message: 'to and text are required' });
  const msg = await Message.create({ from: req.user.id, to, text });
  res.status(201).json(msg);
});

const markRead = asyncHandler(async (req, res) => {
  const msg = await Message.findOneAndUpdate(
    { _id: req.params.id, to: req.user.id, readAt: { $exists: false } },
    { $set: { readAt: new Date() } },
    { new: true }
  );
  if (!msg) return res.status(404).json({ message: 'Message not found or already read' });
  res.json(msg);
});

module.exports = { listInbox, listSent, sendMessage, markRead };


