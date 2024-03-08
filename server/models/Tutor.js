const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			unique: true
		},
		password: { type: String, required: true },
		role: { type: String, required: true, default: 'tutor' },
		language: { type: [String], required: true },
		yearsOfExperience: { type: Number, required: true },
		classes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Class'
			}
		],
		slotsAvailability: [
			{
				date: { startTime: { type: Date, required: true }, endTime: { type: Date, required: true } }
			}
		]
	},
	{
		timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
	}
);

tutorSchema.index({ email: 1 }, { unique: true });

const Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = Tutor;
