const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Donor", "Campaign Organizer"],
      required: true,
    },
    profilePicture: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${this.fullName[0]}&background=6b7280&color=ffffff&size=128`;
      },
    },

    // Fields specific to Donors
    donationHistory: [
      {
        campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    savedCampaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],

    // Fields specific to Campaign Organizers
    campaignsManaged: [
      {
        campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
        title: { type: String, required: true },
        fundsRaised: { type: Number, default: 0 },
      },
    ],
    withdrawalRequests: [
      {
        amount: { type: Number, required: true },
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
        requestedAt: { type: Date, default: Date.now },
      },
    ],

    // Common Fields
    notifications: [
      {
        message: { type: String, required: true },
        type: {
          type: String,
          enum: ["Donation Update", "Campaign Update", "General"],
          required: true,
        },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    badges: [
      {
        name: { type: String, required: true },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    settings: {
      emailNotifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
