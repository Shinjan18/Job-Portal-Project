const mongoose = require('mongoose');

const quickApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, default: '' },
    resumeUrl: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    trackToken: { type: String, required: true, unique: true },
    pdfUrl: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    company: { type: String, default: '' },
  },
  { timestamps: true }
);

quickApplicationSchema.index({ jobId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('QuickApplication', quickApplicationSchema);


