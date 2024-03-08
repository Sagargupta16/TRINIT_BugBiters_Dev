const Student = require('../models/Student');
const logger = require('../utils/logger');

exports.viewAllStudents = async (req, res) => {
	try {
		const students = await Student.find();
		res.json(students);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.viewSingleStudent = async (req, res) => {
	try {
		const { id } = req.params,
			student = await Student.findById(id);
		if (!student) return res.status(404).json({ errors: ['Student not found'] });
		res.json(student);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.updateStudent = async (req, res) => {
	try {
		const { id } = req.params,
			student = await Student.findByIdAndUpdate(id, req.body, { new: true });
		if (!student) return res.status(404).json({ errors: ['Student not found'] });
		res.json(student);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.deleteStudent = async (req, res) => {
	try {
		const { id } = req.params,
			student = await Student.findByIdAndDelete(id);
		if (!student) return res.status(404).json({ errors: ['Student not found'] });
		res.json(student);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
