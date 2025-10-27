const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/**
 * Express middleware to verify Bearer JWT and attach user to req.user
 * Expects Authorization: Bearer <token>
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return res.status(401).json({ error: 'Invalid Authorization format' });
    }

    const token = parts[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // payload expected to contain userId
    const userId = payload.userId || payload.id;
    if (!userId) return res.status(401).json({ error: 'Invalid token payload' });

    const user = await User.findById(userId).lean();
    if (!user) return res.status(401).json({ error: 'User not found' });

    // remove sensitive fields
    delete user.passwordHash;
    delete user.__v;

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = authMiddleware;
