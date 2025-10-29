const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["call", "message", "spam_report"],
      required: true,
      index: true,
    },
    metadata: {
      // For calls: duration in seconds
      duration: Number,
      // For messages: content
      content: String,
      // For spam reports: reason
      reason: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
interactionSchema.index({ initiator: 1, createdAt: -1 });
interactionSchema.index({ receiver: 1, createdAt: -1 });
interactionSchema.index({ initiator: 1, receiver: 1 });
interactionSchema.index({ initiator: 1, type: 1 });
interactionSchema.index({ createdAt: -1 });

const Interaction = mongoose.model("Interaction", interactionSchema);

module.exports = Interaction;
