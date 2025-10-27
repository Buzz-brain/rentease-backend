const mongoose = require('mongoose');

const { Schema } = mongoose;

const PropertySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  address: { type: String },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  landlordId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  landlordName: { type: String },
  landlordAvatar: { type: String },
  available: { type: Boolean, default: true },
  propertyType: { type: String, enum: ['apartment', 'house', 'room', 'studio'], required: true },
  createdAt: { type: Date, default: () => new Date() },
  featured: { type: Boolean, default: false },
});

module.exports = mongoose.model('Property', PropertySchema);