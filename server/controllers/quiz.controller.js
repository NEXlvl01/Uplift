const Campaign = require("../models/campaign.model.js");
const User = require("../models/user.model.js");
const QuizQuestion = require("../models/question.model.js");
const Participant = require("../models/participant.model.js");
const Quiz = require("../models/quiz.model.js");
const { instance } = require("../services/razorpay.service.js");
const crypto = require("crypto");
const { updateCampaignStatus } = require("../services/updateCampaignStatus.js");
const generateCertificate = require("../services/generateCertificate.js");

// route: POST /payment/quiz-order
async function createQuizPaymentOrder(req, res) {
  try {
    const { topic, userId } = req.body;

    const campaigns = await Campaign.find({
      category: topic,
      status: "Active",
    });

    if (!campaigns || campaigns.length === 0) {
      return res
        .status(404)
        .json({ error: "No active campaign found in this topic" });
    }

    // Pick a random campaign
    const randomCampaign =
      campaigns[Math.floor(Math.random() * campaigns.length)];

    const remainingAmount =
      randomCampaign.targetAmount - randomCampaign.fundsRaised;
    if (100 > remainingAmount) {
      return res
        .status(400)
        .json({ error: "Donation exceeds goal for selected campaign" });
    }

    const options = {
      amount: 100 * 100, // ₹100 in paise
      currency: "INR",
      receipt: `quiz_receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.json({ success: true, order, campaignId: randomCampaign._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating quiz order" });
  }
}

// route: POST /payment/verify-quiz
async function verifyQuizPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      userId,
      campaignId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      {
        $inc: { fundsRaised: amount },
        $push: { donations: { donorId: userId, amount } },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      $push: {
        donationHistory: {
          campaignId,
          amount,
          date: new Date(),
        },
      },
    });

    await updateCampaignStatus(campaign);

    res.json({ success: true, message: "Quiz donation recorded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Quiz payment verification failed" });
  }
}

async function getQuizQuestions(req, res) {
  try {
    const questions = await QuizQuestion.find({
      category: req.params.category,
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

async function submitQuiz(req, res) {
  console.log("Hiii");
  const userId = req.user.id;
  const { quizTopic, score, answers } = req.body;

  try {
    const quizCampaign = await Quiz.findOne({ title: quizTopic });
    const user = await User.findById(userId);

    if (!quizCampaign) return res.status(404).json({ error: "Quiz not found" });

    let participant = await Participant.findOne({
      user: userId,
      quizCampaign: quizCampaign._id,
    });
    if (!participant) {
      participant = new Participant({
        user: userId,
        quizCampaign: quizCampaign._id,
      });
    }

    participant.score = score;

    const certUrl = await generateCertificate(user.name, score, quizTopic);
    participant.certificateUrl = certUrl;

    await participant.save();
    quizCampaign.totalParticipants += 1;
    await quizCampaign.save();

    res
      .status(200)
      .json({ message: "Quiz submitted", certificateUrl: certUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = {
  createQuizPaymentOrder,
  verifyQuizPayment,
  getQuizQuestions,
  submitQuiz,
};
