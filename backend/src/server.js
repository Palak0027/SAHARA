const path = require('path');
const dotenv = require('dotenv');

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/error.middleware');

// Route Imports
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SAHARA Backend API is running',
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);

// Centralized Error Handling Middleware (must be after all routes)
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 Auth API available at http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
};

startServer();
