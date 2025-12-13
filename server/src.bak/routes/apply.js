const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/apply/:jobId - alias to apply to a job
router.post('/:jobId', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        
        // Check if already applied using Application model
        const existingApp = await Application.findOne({
            job: job._id,
            applicant: req.user.id
        });
        
        if (existingApp) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }
        
        // Create application with status 'Pending'
        const application = await Application.create({
            job: job._id,
            applicant: req.user.id,
            status: 'Pending'
        });
        
        // Update job applicants array
        if (!job.applicants.includes(req.user.id)) {
            job.applicants.push(req.user.id);
            await job.save();
        }
        
        // Update user's applied jobs
        await User.findByIdAndUpdate(req.user.id, { $addToSet: { appliedJobs: job._id } });
        
        res.json({ success: true, message: 'Application submitted successfully', data: application });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }
        console.error('Apply error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
});

module.exports = router;



