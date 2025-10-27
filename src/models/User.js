const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'landlord', 'admin'], default: 'student' },
  phone: { type: String },
  avatar: { type: String },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model('User', UserSchema);
