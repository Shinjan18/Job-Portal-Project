const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		company: { type: String, required: true },
		salaryRange: { type: String, default: '' },
		skillsRequired: { type: [String], default: [] },
		experienceLevel: { type: String, default: '' },
		jobType: { type: String, default: '' },
		location: { type: String, default: '' },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);



