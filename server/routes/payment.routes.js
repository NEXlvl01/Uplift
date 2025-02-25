const express = require("express");
const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/campaign.controller.js");

const router = express.Router();

router.post("/create-order", createPaymentOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
