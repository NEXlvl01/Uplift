const express = require("express");
const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/campaign.controller.js");
const {createQuizPaymentOrder,verifyQuizPayment} = require("../controllers/quiz.controller.js");

const router = express.Router();

router.post("/create-order", createPaymentOrder);
router.post("/verify-payment", verifyPayment);
router.post("/quiz-order",createQuizPaymentOrder);
router.post("/verify-quiz",verifyQuizPayment);

module.exports = router;
