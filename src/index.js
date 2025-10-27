const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const propertyRoutes = require('./routes/properties');
const messageRoutes = require('./routes/messages');
const favoriteRoutes = require('./routes/favorites');
const errorHandler = require('./middleware/errorHandler');
const { connectDB } = require('./utils/db');

dotenv.config();


const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'rentopia-backend' }));

app.use('/auth', authRoutes);
// Sample protected routes
app.use('/protected', protectedRoutes);
// Property management
app.use('/properties', propertyRoutes);
app.use('/messages', messageRoutes);
app.use('/favorites', favoriteRoutes);

// Global error handler (should be last)
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
