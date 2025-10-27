const { Router } = require('express');
const { signup, login, getProfile, updateProfile, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Profile management
router.get('/profile', auth, getProfile);
router.put('/update-profile', auth, updateProfile);

module.exports = router;
