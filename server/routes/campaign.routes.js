const express = require("express");
const {
  addCampaign,
  getMyCampaigns,
  getCampaignStats,
  getCampaignByID,
  postComment,
  getCommentsByCampaignID,
  getFundsByCategory,
} = require("../controllers/campaign.controller.js");

const router = express.Router();

router.post("/add", addCampaign);
router.get("/my-campaigns", getMyCampaigns);
router.get("/stats", getCampaignStats);
router.get("/details/:id", getCampaignByID);
router.post("/:id/comments", postComment);
router.get("/:id/comments", getCommentsByCampaignID);
router.get("/fundsbycategory", getFundsByCategory);

module.exports = router;
