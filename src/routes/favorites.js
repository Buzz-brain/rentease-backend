const { Router } = require('express');
const auth = require('../middleware/auth');
const favoriteController = require('../controllers/favoriteController');

const router = Router();

// Save property to favorites
router.post('/:propertyId', auth, favoriteController.saveFavorite);

// Get all favorites for user
router.get('/', auth, favoriteController.getFavorites);

module.exports = router;
