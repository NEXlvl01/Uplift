const Campaign = require("../models/campaign.model.js");
const User = require("../models/user.model.js");
const { updateCampaignStatus } = require("../services/updateCampaignStatus.js");
const { instance } = require("../services/razorpay.service.js");
const crypto = require("crypto");

async function addCampaign(req, res) {
  try {
    const {
      title,
      description,
      targetAmount,
      category,
      location,
      urgency,
      endDate,
    } = req.body;
    if (
      !title ||
      !description ||
      !targetAmount ||
      !category ||
      !location ||
      !urgency ||
      !endDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const organizer = req.user.id;

    const newCampaign = new Campaign({
      title,
      description,
      organizer,
      targetAmount,
      category,
      location,
      urgency,
      endDate,
    });

    await newCampaign.save();

    res.status(201).json(newCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getMyCampaigns(req, res) {
  try {
    const userId = req.user.id;
    const campaigns = await Campaign.find({ organizer: userId });
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getCampaignStats(req, res) {
  try {
    const userId = req.user.id;

    const campaigns = await Campaign.find({ organizer: userId });

    const totalRaised = campaigns.reduce(
      (sum, campaign) => sum + campaign.fundsRaised,
      0
    );

    const uniqueDonors = new Set();
    campaigns.forEach((campaign) => {
      campaign.donations.forEach((donation) => {
        uniqueDonors.add(donation.donorId.toString());
      });
    });

    const activeCampaigns = campaigns.filter(
      (campaign) => campaign.status === "Active"
    ).length;

    res.json({
      totalRaised,
      totalDonors: uniqueDonors.size,
      activeCampaigns,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching campaign statistics" });
  }
}

async function getCampaignByID(req, res) {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "organizer",
      "fullName"
    );
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    await updateCampaignStatus(campaign);
    res.json(campaign);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching campaign", error });
  }
}

async function postComment(req, res) {
  try {
    const { userId, text } = req.body;
    if (!userId || !text) {
      return res.status(400).json({ message: "Missing userId or text" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const newComment = {
      userId,
      text,
      createdAt: new Date(),
    };
    campaign.comments.push(newComment);
    await campaign.save();

    res.status(201).json({ user: { name: user.fullName }, text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding comment", error });
  }
}

async function getCommentsByCampaignID(req, res) {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id).populate(
      "comments.userId",
      "fullName profilePicture"
    );

    // console.log(campaign.comments);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({ comments: campaign.comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
}

async function createPaymentOrder(req, res) {
  try {
    const { amount, campaignId } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    const remainingAmount = campaign.targetAmount - campaign.fundsRaised;

    if (amount > remainingAmount) {
      return res.status(400).json({ error: "Donation exceeds remaining goal" });
    }

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating order" });
  }
}

async function verifyPayment(req, res) {
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

    res.json({ success: true, message: "Payment successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Payment verification failed" });
  }
}

async function getFundsByCategory(req, res) {
  try {
    const activeCampaigns = await Campaign.find({ status: "Active" }).select(
      "title category"
    );

    const fundraisingData = await Campaign.aggregate([
      {
        $group: {
          _id: "$category",
          totalFunds: { $sum: "$fundsRaised" },
        },
      },
      { $sort: { totalFunds: -1 } },
    ]);

    res.json({
      activeCampaigns,
      fundraisingData,
    });
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllCampaigns(req, res) {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching campaigns" });
  }
}

module.exports = {
  addCampaign,
  getMyCampaigns,
  getCampaignStats,
  getCampaignByID,
  postComment,
  getCommentsByCampaignID,
  createPaymentOrder,
  verifyPayment,
  getFundsByCategory,
  getAllCampaigns,
};
