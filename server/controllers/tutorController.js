const Tutor = require('../models/Tutor');
const logger = require('../utils/logger');

exports.viewAllTutors = async (req, res) => {
	try {
		const tutors = await Tutor.find();
		res.json(tutors);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.viewSingleTutor = async (req, res) => {
	try {
		const { id } = req.params,
			tutor = await Tutor.findById(id);
		if (!tutor) return res.status(404).json({ errors: ['Tutor not found'] });
		res.json(tutor);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.updateTutor = async (req, res) => {
	try {
		const { id } = req.params,
			tutor = await Tutor.findByIdAndUpdate(id, req.body, { new: true });
		if (!tutor) return res.status(404).json({ errors: ['Tutor not found'] });
		res.json(tutor);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.deleteTutor = async (req, res) => {
	try {
		const { id } = req.params,
			tutor = await Tutor.findByIdAndDelete(id);
		if (!tutor) return res.status(404).json({ errors: ['Tutor not found'] });
		res.json(tutor);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
