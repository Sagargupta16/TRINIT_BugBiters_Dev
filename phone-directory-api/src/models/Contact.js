const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const contactSchema = new mongoose.Schema(
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
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Link to registered user if this contact is also a registered user
    registeredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
    },
    spamLikelihood: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate contacts for the same owner
contactSchema.index({ owner: 1, phoneNumber: 1 }, { unique: true });
contactSchema.index({ name: "text" }); // Text index for fuzzy search

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
