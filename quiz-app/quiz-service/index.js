const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const quizRoutes = require('./routes/quiz.routes');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB - Quiz Service'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use('/', quizRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Quiz Service running on port ${PORT}`));
