const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		language: { type: String, required: true },
		level: { type: String, required: true },
		questions: [
			{
				question: { type: String, required: true },
				options: { type: [String], required: true },
				correctAnswer: { type: String, required: true }
			}
		]
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
	}
);

const Test = mongoose.model('Test', testSchema);
