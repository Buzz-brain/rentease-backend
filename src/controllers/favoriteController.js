const SavedProperty = require('../models/SavedProperty');
const Property = require('../models/Property');

// POST /favorites/:propertyId - save property
exports.saveFavorite = async function (req, res) {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can save favorites' });
    }
    const { propertyId } = req.params;
    if (!propertyId) return res.status(422).json({ error: 'Missing propertyId' });
    // Prevent duplicate
    const exists = await SavedProperty.findOne({ userId: req.user._id, propertyId });
    if (exists) return res.status(409).json({ error: 'Already saved' });
    const saved = new SavedProperty({ userId: req.user._id, propertyId });
    await saved.save();
    return res.status(201).json({ saved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /favorites - view all saved properties
exports.getFavorites = async function (req, res) {
  try {
    if (!req.user || req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can view favorites' });
    }
    const favorites = await SavedProperty.find({ userId: req.user._id }).populate('propertyId');
    // Return array of property objects
    const properties = favorites.map(fav => fav.propertyId);
    return res.json({ data: properties });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
