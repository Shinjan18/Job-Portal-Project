const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const QuickApplication = require('../models/QuickApplication');
const auth = require('../middleware/auth');

const router = express.Router();

// Job seeker: my applications
router.get('/mine', auth, async (req, res) => {
    try {
        const apps = await Application.find({ applicant: req.user.id })
            .populate('job', 'title company location')
            .sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Employer: applications to my jobs
router.get('/employer', auth, async (req, res) => {
    try {
        const myJobIds = await Job.find({ createdBy: req.user.id }).distinct('_id');
        const apps = await Application.find({ job: { $in: myJobIds } })
            .populate('job', 'title company location')
            .populate('applicant', 'name email')
            .sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Employer: update application status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const app = await Application.findById(req.params.id).populate('job', 'createdBy');
        if (!app) return res.status(404).json({ message: 'Application not found' });
        if (String(app.job.createdBy) !== String(req.user.id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { status } = req.body;
        app.status = status || app.status;
        await app.save();
        res.json(app);
    } catch (err) {
        res.status(400).json({ message: 'Invalid id' });
    }
});

// Public tracking endpoint
router.get('/track', async (req, res) => {
    const { token, email } = req.query;
    if (!token || !email) {
        return res.status(400).json({ success: false, message: 'token and email required' });
    }

    try {
        const app = await QuickApplication.findOne({ trackToken: token, email: String(email).toLowerCase() }).lean();
        if (!app) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        const base = process.env.API_BASE_URL || 'http://localhost:5000';
        const resumeUrlFull = app.resumeUrl ? `${base}${app.resumeUrl}` : '';
        const pdfUrlFull = app.pdfUrl ? `${base}${app.pdfUrl}` : '';
        return res.json({
            success: true,
            application: {
                jobId: app.jobId,
                name: app.name,
                email: app.email,
                phone: app.phone,
                message: app.message,
                resumeUrl: app.resumeUrl,
                resumeUrlFull,
                status: app.status,
                jobTitle: app.jobTitle,
                company: app.company,
                createdAt: app.createdAt,
                pdfUrl: app.pdfUrl,
                pdfUrlFull,
            }
        });
    } catch (err) {
        console.error('Track endpoint error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;



