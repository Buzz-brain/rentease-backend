const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rentopia';
  await mongoose.connect(uri, {
    // useNewUrlParser and useUnifiedTopology are defaults in modern mongoose
  });
  console.log('Connected to MongoDB');
}

module.exports = { connectDB };
