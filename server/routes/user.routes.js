const express = require("express");
const {
  userLogin,
  userSignup,
  getUserByID,
  updateUser,
  getSavedCampaigns,
  unsaveCampaign,
  saveCampaign,
  getUserStats,
  getDonationSummary,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.get("/:id", getUserByID);
router.put("/update/:id", updateUser);
router.get("/:id/saved-campaigns", getSavedCampaigns);
router.post("/:id/unsave-campaign", unsaveCampaign);
router.post("/:id/save-campaign", saveCampaign);
router.get("/:userId/stats", getUserStats);
router.get("/donation-summary/:userID",getDonationSummary);

module.exports = router;
