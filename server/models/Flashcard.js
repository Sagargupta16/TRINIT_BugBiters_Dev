const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },

  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

module.exports = Flashcard;
