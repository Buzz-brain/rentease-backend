const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function sanitizeUser(user) {
  if (!user) return null;
  // Mongoose document
  const obj = user.toObject ? user.toObject() : user;
  const { passwordHash, __v, ...rest } = obj;
  return rest;
}

exports.signup = async function (req, res) {
  try {
    const { email, name, password, role, phone } = req.body;
    if (!email || !name || !password || !role) {
      return res.status(422).json({ error: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, name, role, phone, passwordHash });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).json({ error: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /auth/profile
exports.getProfile = async function (req, res) {
  try {
    // req.user is set by auth middleware
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    return res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// PUT /auth/update-profile
exports.updateProfile = async function (req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const userId = req.user._id;
    const { name, phone, avatar } = req.body;
    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (avatar) update.avatar = avatar;

    const updated = await require('../models/User').findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, lean: true }
    );
    if (!updated) return res.status(404).json({ error: 'User not found' });
    delete updated.passwordHash;
    delete updated.__v;
    return res.json({ user: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// POST /auth/logout
exports.logout = function (req, res) {
  // For stateless JWT, just respond success. If using sessions or blacklisting, clear here.
  return res.json({ success: true, message: 'Logged out (client should discard token)' });
};