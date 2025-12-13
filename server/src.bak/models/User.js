const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true, select: false },
		role: { type: String, enum: ['jobseeker', 'employer'], default: 'jobseeker' },
		education: { type: String, default: '' },
		experience: { type: String, default: '' },
		certifications: { type: [String], default: [] },
		companiesWorkedWith: { type: [String], default: [] },
		currentCTC: { type: Number, default: 0 },
		jobInterests: { type: [String], default: [] },
		appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
		savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
		resumeUrl: { type: String, default: '' },
		resetToken: { type: String },
		resetTokenExpiresAt: { type: Date }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);



