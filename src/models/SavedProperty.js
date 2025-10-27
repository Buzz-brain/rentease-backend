const mongoose = require('mongoose');

const { Schema } = mongoose;

const SavedPropertySchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  savedAt: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model('SavedProperty', SavedPropertySchema);