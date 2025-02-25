const Campaign = require("../models/campaign.model.js");
const User = require("../models/user.model.js");

const updateCampaignStatus = async (campaign) => {
  const currentDate = new Date();
  const isEnded = currentDate > campaign.endDate;
  const isTargetReached = campaign.fundsRaised >= campaign.targetAmount;

  if ((isEnded || isTargetReached) && campaign.status === "Active") {
    campaign.status = "Completed";

    const organizer = await User.findById(campaign.organizer);
    if (organizer) {
      organizer.notifications.push({
        message: `Your campaign "${
          campaign.title
        }" has been marked as completed ${
          isEnded
            ? "as it reached its end date"
            : "as it reached its target amount"
        }.`,
        type: "Campaign Update",
      });
      await organizer.save();
    }

    await campaign.save();
    return true;
  }
  return false;
};

const scheduledStatusUpdate = async () => {
  try {
    const activeCampaigns = await Campaign.find({ status: "Active" });

    for (const campaign of activeCampaigns) {
      await updateCampaignStatus(campaign);
    }
  } catch (error) {
    console.error("Error in scheduled campaign status update:", error);
  }
};

module.exports = {
  updateCampaignStatus,
  scheduledStatusUpdate,
};
