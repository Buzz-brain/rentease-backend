
const { Router } = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const propertyController = require('../controllers/propertyController');
const multer = require('multer');
const path = require('path');

// Set up multer for local image storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../uploads'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + '-' + file.originalname);
	}
});
const upload = multer({ storage });

const router = Router();

// Create property (landlord only, with image upload)
router.post('/', auth, role('landlord'), upload.array('images', 10), propertyController.createProperty);

// Get all properties (public, with filters)
router.get('/', propertyController.getProperties);

// Get properties by landlord user id (protected)
router.get('/user/:id', auth, propertyController.getPropertiesByUser);

// Get property by id (public)
router.get('/:id', propertyController.getPropertyById);

// Update property (landlord only)
router.put('/:id', auth, role('landlord'), propertyController.updateProperty);

// Delete property (landlord only)
router.delete('/:id', auth, role('landlord'), propertyController.deleteProperty);

module.exports = router;