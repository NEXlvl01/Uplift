const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Medical", "Education", "Disaster Relief", "Community Support", "Animal Welfare"],
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
});

const QuizQuestion = mongoose.model("QuizQuestion", quizQuestionSchema);

module.exports = QuizQuestion;
