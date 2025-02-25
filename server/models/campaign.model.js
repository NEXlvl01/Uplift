const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    fundsRaised: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: [
        "Medical",
        "Education",
        "Disaster Relief",
        "Community Support",
        "Animal Welfare",
        "Other",
      ],
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Completed", "Paused"],
      default: "Active",
    },
    donations: [
      {
        donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: { type: Number, required: true },
        donatedAt: { type: Date, default: Date.now },
      },
    ],
    withdrawalRequests: [
      {
        amount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [{ type: String }],
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
