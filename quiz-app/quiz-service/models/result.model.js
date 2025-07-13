const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  selected_option: { type: Number, required: true },
  is_correct: { type: Boolean, required: true },
});

const resultSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  user_id: { type: String, required: true },
  score: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  attempt: { type: Number, required: true },
  answers: [answerSchema],
});

module.exports = mongoose.model("Result", resultSchema);
