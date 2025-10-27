const Property = require('../models/Property');
const User = require('../models/User');

// POST /properties - create property (landlord only)

exports.createProperty = async function (req, res) {
  try {
    if (!req.user || req.user.role !== 'landlord') {
      return res.status(403).json({ error: 'Only landlords can create properties' });
    }
    // Handle image upload via multer
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => '/uploads/' + f.filename);
    } else if (req.body.images) {
      // fallback for image URLs
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    const {
      title, description, price, location, address,
      bedrooms, bathrooms, amenities, propertyType, available, featured
    } = req.body;
    if (!title || !description || !price || !location || !bedrooms || !bathrooms || !propertyType) {
      return res.status(422).json({ error: 'Missing required fields' });
    }
    const property = new Property({
      title,
      description,
      price,
      location,
      address,
      bedrooms,
      bathrooms,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [],
      images,
      propertyType,
      available: available !== undefined ? available : true,
      featured: featured || false,
      landlordId: req.user._id,
      landlordName: req.user.name,
      landlordAvatar: req.user.avatar,
    });
    await property.save();
    return res.status(201).json({ property });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /properties - public, with filters
exports.getProperties = async function (req, res) {
  try {
    const {
      q, location, minPrice, maxPrice, propertyType, bedrooms, available, featured, page = 1, limit = 20
    } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ];
    }
    if (location) filter.location = location;
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (available !== undefined) filter.available = available === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const skip = (Number(page) - 1) * Number(limit);
    const properties = await Property.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Property.countDocuments(filter);
    return res.json({ data: properties, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /properties/:id - public, details
exports.getPropertyById = async function (req, res) {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    return res.json({ property });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// PUT /properties/:id - landlord only
exports.updateProperty = async function (req, res) {
  try {
    if (!req.user || req.user.role !== 'landlord') {
      return res.status(403).json({ error: 'Only landlords can update properties' });
    }
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.landlordId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not own this property' });
    }
    const update = req.body;
    Object.assign(property, update);
    await property.save();
    return res.json({ property });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /properties/:id - landlord only
exports.deleteProperty = async function (req, res) {
  try {
    if (!req.user || req.user.role !== 'landlord') {
      return res.status(403).json({ error: 'Only landlords can delete properties' });
    }
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    if (property.landlordId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not own this property' });
    }
    await property.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /properties/user/:id - get properties by landlord user id
exports.getPropertiesByUser = async function (req, res) {
  try {
    const landlordId = req.params.id;
    // Only allow access if requester is the same user or an admin
    if (!req.user || (req.user._id.toString() !== landlordId && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const properties = await Property.find({ landlordId }).sort({ createdAt: -1 });
    return res.json({ data: properties });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

