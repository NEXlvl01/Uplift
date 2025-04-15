const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizCampaign: { type: mongoose.Schema.Types.ObjectId, ref: "QuizCampaign" },
  score: Number,
  participatedAt: { type: Date, default: Date.now },
  certificateUrl: String,
});

const Participant = mongoose.model("Participant", participationSchema);

module.exports = Participant;