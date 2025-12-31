const mongoose = require("mongoose");

const spamReportSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Reference to the reported user if they're registered
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reports from the same user for the same number
spamReportSchema.index(
  { phoneNumber: 1, reportedBy: 1 },
  { unique: true }
);

// Index for efficient aggregation queries
spamReportSchema.index({ phoneNumber: 1, createdAt: -1 });

const SpamReport = mongoose.model("SpamReport", spamReportSchema);

module.exports = SpamReport;
