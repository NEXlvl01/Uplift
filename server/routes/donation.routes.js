const express = require("express");
const {getRecentDonations} = require("../controllers/donation.controller.js");

const router = express.Router();

router.get("/recent-donations",getRecentDonations);

module.exports = router;