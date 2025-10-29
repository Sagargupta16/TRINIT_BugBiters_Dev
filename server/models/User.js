const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allows null values with unique constraint
    },
    password: {
      type: String,
      required: true,
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
        default: [],
      },
    ],
    spamReportsReceived: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
userSchema.index({ phoneNumber: 1 });
userSchema.index({ name: "text" }); // Text index for fuzzy search
userSchema.index({ email: 1 }, { sparse: true, unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
