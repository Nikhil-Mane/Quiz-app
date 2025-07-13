// quiz-service/app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const quizRoutes = require("./routes/quiz.routes");

dotenv.config();

const app = express();
app.use(express.json());

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("DB connection error:", err));
app.use("/", quizRoutes);

module.exports = app;
