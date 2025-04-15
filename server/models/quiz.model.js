const mongoose = require("mongoose");

const quizCampaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  participationFee: Number,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
  certificateTemplateUrl: String,
  totalParticipants: {
    type: Number,
    default: 0,
  },
});

const Quiz = mongoose.model("Quiz", quizCampaignSchema);

module.exports = Quiz;
