const { Router } = require('express');
const auth = require('../middleware/auth');

const router = Router();

// GET /protected/me - returns the authenticated user's profile
router.get('/me', auth, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
