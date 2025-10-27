const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConversationSchema = new Schema({
  conversationId: { type: String, unique: true, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  unreadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model('Conversation', ConversationSchema);