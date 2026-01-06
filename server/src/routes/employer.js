const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');
const QuickApplication = require('../models/QuickApplication');

// Middleware to ensure user is employer
const ensureEmployer = (req, res, next) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Access denied. Employers only.' });
    }
    next();
};

router.get('/overview', auth, ensureEmployer, async (req, res) => {
    try {
        // 1. Get all jobs posted by this employer
        const jobs = await Job.find({ createdBy: req.user.id });
        const jobIds = jobs.map(job => job._id);

        // 2. Count total jobs
        const totalJobs = jobs.length;

        // 3. Get applications for these jobs (Regular + Quick)
        // Regular applications
        const regularApps = await Application.find({ job: { $in: jobIds } })
            .populate('job', 'title')
            .populate('applicant', 'name email') // assuming applicant wraps User
            .lean();

        // Quick applications
        const quickApps = await QuickApplication.find({ jobId: { $in: jobIds } }).lean();

        // Combine them for stats
        // Normalize quick apps to look like regular apps for stats counting
        const allApps = [
            ...regularApps.map(app => ({
                ...app,
                source: 'regular',
                applicantName: app.applicant?.name || 'Unknown',
                jobTitle: app.job?.title || 'Unknown',
                appliedAt: app.createdAt
            })),
            ...quickApps.map(app => ({
                ...app,
                _id: app._id,
                status: app.status,
                source: 'quick',
                applicantName: app.name,
                jobTitle: app.jobTitle,
                appliedAt: app.createdAt
            }))
        ];

        const totalApplications = allApps.length;
        const pending = allApps.filter(a => a.status === 'Pending').length;
        const interviews = allApps.filter(a => a.status === 'Interview').length;

        // 4. Get recent 5 applications
        // Sort by createdAt desc
        const recent = allApps
            .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
            .slice(0, 5)
            .map(app => ({
                _id: app._id,
                name: app.applicantName,
                jobTitle: app.jobTitle,
                status: app.status,
                appliedAt: app.appliedAt,
                source: app.source
            }));

        res.json({
            totalJobs,
            totalApplications,
            pending,
            interviews,
            recent
        });
    } catch (error) {
        console.error('Employer overview error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all applications for employer
router.get('/applications', auth, ensureEmployer, async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.id });
        const jobIds = jobs.map(job => job._id);

        // Regular apps
        const regularApps = await Application.find({ job: { $in: jobIds } })
            .populate('job', 'title')
            .populate('applicant', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        // Quick apps
        const quickApps = await QuickApplication.find({ jobId: { $in: jobIds } })
            .sort({ createdAt: -1 })
            .lean();

        // Normalize
        const allApps = [
            ...regularApps.map(app => ({
                _id: app._id,
                applicant: app.applicant,
                job: app.job,
                status: app.status,
                createdAt: app.createdAt,
                resumeUrl: app.resumeUrl, // standard apps usually store resume in user profile or app
                coverLetter: app.coverLetter,
                source: 'regular'
            })),
            ...quickApps.map(app => ({
                _id: app._id,
                applicant: { name: app.name, email: app.email },
                job: { title: app.jobTitle },
                status: app.status,
                createdAt: app.createdAt,
                resumeUrl: app.resumeUrl,
                pdfUrl: app.pdfUrl,
                source: 'quick'
            }))
        ];

        // Sort combined
        allApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(allApps);
    } catch (error) {
        console.error('Employer applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single application
router.get('/applications/:id', auth, ensureEmployer, async (req, res) => {
    try {
        const { id } = req.params;

        // Check regular first
        let app = await Application.findById(id)
            .populate('job')
            .populate('applicant');

        if (app) {
            // Check ownership of job
            const job = await Job.findById(app.job._id);
            if (String(job.createdBy) !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
            return res.json({
                ...app.toObject(),
                source: 'regular'
            });
        }

        // Check quick
        app = await QuickApplication.findById(id);
        if (!app) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership
        // Quick app stores jobId
        const job = await Job.findById(app.jobId);
        if (!job || String(job.createdBy) !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({
            ...app.toObject(),
            job: { _id: job._id, title: job.title, company: job.company },
            applicant: { name: app.name, email: app.email, phone: app.phone },
            source: 'quick'
        });

    } catch (error) {
        console.error('Application detail error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update status
router.patch('/applications/:id/status', auth, ensureEmployer, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Try find regular
        let app = await Application.findById(id);
        if (app) {
            const job = await Job.findById(app.job);
            if (String(job.createdBy) !== req.user.id) return res.status(403).json({ message: 'Access denied' });
            app.status = status;
            await app.save();
            return res.json(app);
        }

        // Try quick
        app = await QuickApplication.findById(id);
        if (app) {
            const job = await Job.findById(app.jobId);
            if (String(job.createdBy) !== req.user.id) return res.status(403).json({ message: 'Access denied' });
            app.status = status;
            await app.save();
            return res.json(app);
        }
        res.status(404).json({ message: 'Not found' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
