const Campaign = require("../models/campaign.model.js");
const User = require("../models/user.model.js");

async function getRecentDonations(req, res) {
  try {
    const campaigns = await Campaign.find({ "donations.0": { $exists: true } })
      .select("_id title category donations")
      .sort({ updatedAt: -1 })
      .limit(10);

    let recentDonations = [];

    for (const campaign of campaigns) {
      const campaignDonations = campaign.donations
        .sort((a, b) => new Date(b.donatedAt) - new Date(a.donatedAt))
        .slice(0, 5);

      for (const donation of campaignDonations) {
        const donor = await User.findById(donation.donorId).select("fullName");

        if (donor) {
          recentDonations.push({
            _id: donation._id,
            donorId: donation.donorId,
            donorName: donor.fullName,
            amount: donation.amount,
            donatedAt: donation.donatedAt,
            campaignId: campaign._id,
            campaignTitle: campaign.title,
            campaignCategory: campaign.category,
          });
        }
      }
    }

    recentDonations.sort(
      (a, b) => new Date(b.donatedAt) - new Date(a.donatedAt)
    );

    recentDonations = recentDonations.slice(0, 20);

    res.status(200).json({ success: true, donations: recentDonations });
  } catch (error) {
    console.error("Error fetching recent donations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { getRecentDonations };
