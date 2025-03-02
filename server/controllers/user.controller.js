const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

async function userSignup(req, res) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ fullName, email, password, role });
    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: newUser._id, fullName, email, role },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, fullName: user.fullName, email, role: user.role },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

async function getUserByID(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;

    if (req.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this profile" });
    }

    const { fullName, email, role } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        role,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getSavedCampaigns(req, res) {
  try {
    const user = await User.findById(req.params.id).populate("savedCampaigns");
    res.json(user.savedCampaigns.map((campaign) => campaign._id));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching saved campaigns" });
  }
}

async function unsaveCampaign(req, res) {
  try {
    const { campaignId } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { savedCampaigns: campaignId },
    });
    res.json({ message: "Campaign unsaved" });
  } catch (error) {
    res.status(500).json({ error: "Error unsaving campaign" });
  }
}

async function saveCampaign(req, res) {
  try {
    const { campaignId } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { savedCampaigns: campaignId },
    });
    res.json({ message: "Campaign saved" });
  } catch (error) {
    res.status(500).json({ error: "Error saving campaign" });
  }
}

async function getUserStats(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("donationHistory.campaignId", "title")
      .populate("savedCampaigns");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalDonated = user.donationHistory.reduce(
      (sum, donation) => sum + donation.amount,
      0
    );

    res.json({
      totalDonated,
      donationHistory: user.donationHistory,
      savedCampaigns: user.savedCampaigns,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getDonationSummary(req, res) {
  try {
    const { userID } = req.params;

    const user = await User.findById(userID).populate(
      "donationHistory.campaignId"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const categoryTotals = {};

    user.donationHistory.forEach(({ campaignId, amount }) => {
      if (campaignId && campaignId.category) {
        const category = campaignId.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    });

    const donationSummary = Object.keys(categoryTotals).map((category) => ({
      name: category,
      amount: categoryTotals[category],
    }));

    res.json(donationSummary);
  } catch (error) {
    console.error("Error fetching donation summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  userLogin,
  userSignup,
  getUserByID,
  updateUser,
  getSavedCampaigns,
  unsaveCampaign,
  saveCampaign,
  getUserStats,
  getDonationSummary,
};
