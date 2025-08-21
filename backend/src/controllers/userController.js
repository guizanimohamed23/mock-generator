const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { name: 1, email: 1, role: 1, createdAt: 1 }).sort({ createdAt: -1 });
  res.json(users);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id, { name: 1, email: 1, role: 1, createdAt: 1 });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { name, email, role } },
    { new: true, projection: { name: 1, email: 1, role: 1 } }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ ok: true });
});

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };


