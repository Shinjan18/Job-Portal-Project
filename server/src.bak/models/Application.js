const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
        applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['Pending', 'Submitted', 'Under Review', 'Interview', 'Rejected', 'Accepted', 'Approved'], default: 'Pending' },
        resumeUrl: { type: String, default: '' },
        note: { type: String, default: '' }
    },
    { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);



