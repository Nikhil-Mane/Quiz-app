const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');

dotenv.config();
const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ User Service: MongoDB connected'))
  .catch(err => console.error('❌ Mongo Error:', err));

// Auth routes
app.use('/', authRoutes);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 User Service running on port ${process.env.PORT}`);
});
