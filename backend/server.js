import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import errorHandler from './src/middleware/errorHandler.js';

// Route imports
import authRoutes from './src/routes/auth.js';
import medicineRoutes from './src/routes/medicines.js';
import orderRoutes from './src/routes/orders.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

await mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MedOps server is running',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MedOps Backend - Pharmacy Medicine Tracking & Ordering System',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      medicines: '/api/medicines',
      batches: '/api/batches',
      orders: '/api/orders',
      notifications: '/api/notifications',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);

// 404 Route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
