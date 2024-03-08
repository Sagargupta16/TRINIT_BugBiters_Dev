const User = require('../models/User');
const logger = require('../utils/logger');

exports.viewAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.viewSingleUser = async (req, res) => {
	try {
		const { id } = req.params,
			user = await User.findById(id);
		if (!user) return res.status(404).json({ errors: ['User not found'] });
		res.json(user);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { id } = req.params,
			user = await User.findByIdAndUpdate(id, req.body, { new: true });
		if (!user) return res.status(404).json({ errors: ['User not found'] });
		res.json(user);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params,
			user = await User.findByIdAndDelete(id);
		if (!user) return res.status(404).json({ errors: ['User not found'] });
		res.json(user);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ errors: ['Internal server error'] });
	}
};
