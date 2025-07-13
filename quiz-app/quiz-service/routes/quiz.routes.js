const express = require("express");
const Quiz = require("../models/quiz.model");
const Result = require("../models/result.model");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Create a new quiz
router.post("/", verifyToken, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create quiz", error: err.message });
  }
});

// Get quiz questions (without correct answers)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const questions = quiz.questions.map((q) => ({
      id: q._id,
      text: q.text,
      options: q.options,
    }));

    res.json({ id: quiz._id, title: quiz.title, questions });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving quiz", error: err.message });
  }
});

// Submit all answers at once and evaluate quiz
router.post("/:quizId/submit", verifyToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.quizId;
    const user_id = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Score calculation
    let score = 0;
    const answerResults = [];

    for (const ans of answers) {
      const question = quiz.questions.id(ans.question_id);
      if (!question) continue;

      const isCorrect = question.correct_option === ans.selected_option;
      if (isCorrect) score++;

      answerResults.push({
        question_id: ans.question_id,
        selected_option: ans.selected_option,
        is_correct: isCorrect,
        correct_option: question.correct_option,
      });
    }

    const totalQuestions = quiz.questions.length;
    const passed = score >= Math.ceil(totalQuestions * 0.5);

    // Find how many attempts exist for this quiz + user
    const previousAttempts = await Result.countDocuments({
      quiz_id: quizId,
      user_id,
    });
    const attempt = previousAttempts + 1;

    // Save result with attempt number
    const result = new Result({
      quiz_id: quizId,
      user_id,
      score,
      passed,
      attempt,
      answers: answerResults,
    });

    await result.save();

    res.json({
      attempt,
      score,
      total_questions: totalQuestions,
      passed,
      answers: answerResults,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to submit quiz", error: err.message });
  }
});

/// Get all attempt results of a user for a quiz
router.get("/:id/results/:userId", verifyToken, async (req, res) => {
  try {
    const results = await Result.find({
      quiz_id: req.params.id,
      user_id: req.params.userId,
    }).sort({ attempt: 1 });

    if (!results.length)
      return res.status(404).json({ message: "No attempts found" });

    res.json({ attempts: results.length, results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching results", error: err.message });
  }
});

module.exports = router;
