const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: () => new Date() },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', MessageSchema);