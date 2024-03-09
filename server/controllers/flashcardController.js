const logger = require("../utils/logger");
const Flashcard = require("../models/Flashcard");

exports.viewAllFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.json(flashcards);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.viewSingleFlashcard = async (req, res) => {
  try {
    const { id } = req.params,
      flashcard = await Flashcard.findById(id);
    if (!flashcard)
      return res.status(404).json({ errors: ["Flashcard not found"] });
    res.json(flashcard);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.createFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.create(req.body);
    res.json(flashcard);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.updateFlashcard = async (req, res) => {
  try {
    const { id } = req.params,
      flashcard = await Flashcard.findByIdAndUpdate(id, req.body, {
        new: true,
      });
    if (!flashcard)
      return res.status(404).json({ errors: ["Flashcard not found"] });
    res.json(flashcard);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.deleteFlashcard = async (req, res) => {
  try {
    const { id } = req.params,
      flashcard = await Flashcard.findByIdAndDelete(id);
    if (!flashcard)
      return res.status(404).json({ errors: ["Flashcard not found"] });
    res.json(flashcard);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};
