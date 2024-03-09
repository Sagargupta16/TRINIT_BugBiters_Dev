const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
    },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "student" },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        default: [],
      },
    ],
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        default: [],
      },
    ],
    flashcards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flashcard",
        default: [],
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

studentSchema.index({ email: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
