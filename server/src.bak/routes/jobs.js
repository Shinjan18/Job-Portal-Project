const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const QuickApplication = require('../models/QuickApplication');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');
const PDFDocument = require('pdfkit');

const router = express.Router();

// Multer setup for quick apply resumes
const resumesDir = path.join(__dirname, '..', '..', 'uploads', 'resumes');
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir, { recursive: true });
const pdfDir = path.join(__dirname, '..', '..', 'uploads', 'pdfs');
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, resumesDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname || '').slice(0, 10) || '.pdf';
    cb(null, `quick-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = (path.extname(file.originalname || '') || '').toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Only pdf, doc, docx allowed'));
    }
    cb(null, true);
  },
});

router.get('/', async (req, res) => {
    try {
        const { q, type, location, jobType, page = 1, limit = 10, search } = req.query;
        const filter = {};
        
        // Search query - supports title, company, location, description
        const searchQuery = search || q;
        if (searchQuery && String(searchQuery).trim()) {
            filter.$or = [
                { title: { $regex: String(searchQuery).trim(), $options: 'i' } },
                { description: { $regex: String(searchQuery).trim(), $options: 'i' } },
                { company: { $regex: String(searchQuery).trim(), $options: 'i' } }
            ];
            // Only add location to $or if location filter is not separately specified
            if (!location || !String(location).trim()) {
                filter.$or.push({ location: { $regex: String(searchQuery).trim(), $options: 'i' } });
            }
        }
        
        // Location filter (separate from search - filters results further)
        if (location && String(location).trim()) {
            filter.location = { $regex: String(location).trim(), $options: 'i' };
        }
        
        // Experience level filter
        if (type && String(type).trim()) {
            filter.experienceLevel = { $regex: String(type).trim(), $options: 'i' };
        }
        
        // Job type filter
        if (jobType && String(jobType).trim()) {
            filter.jobType = { $regex: String(jobType).trim(), $options: 'i' };
        }
        
        // Pagination
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
        const skip = (pageNum - 1) * limitNum;
        
        // Get total count for pagination
        const total = await Job.countDocuments(filter);
        
        // Fetch jobs with pagination
        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean();
        
        res.json({
            jobs: jobs || [],
            total: total || 0,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil((total || 0) / limitNum) || 1
        });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

router.get('/:id', async (req, res) => {
	try {
		const job = await Job.findById(req.params.id);
		if (!job) return res.status(404).json({ message: 'Job not found' });
		res.json(job);
	} catch (_) {
		res.status(400).json({ message: 'Invalid id' });
	}
});

router.post(
	'/',
	auth,
	[
		body('title').notEmpty(),
		body('description').notEmpty(),
		body('company').notEmpty()
	],
    async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		try {
            const job = await Job.create({ ...req.body, createdBy: req.user.id });
			res.status(201).json(job);
		} catch (err) {
			res.status(500).json({ message: 'Server error' });
		}
	}
);

router.put('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            req.body,
            { new: true }
        );
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(400).json({ message: 'Invalid id' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        await Application.deleteMany({ job: job._id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid id' });
    }
});

router.post('/:id/apply', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        
        // Check if already applied
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
        
        res.json({ message: 'Application submitted successfully', application });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }
        console.error('Apply error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Guest quick apply
router.post(
  '/:id/quick-apply',
  upload.single('resume'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').notEmpty().withMessage('Phone is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const jobId = req.params.id;
    const { name, email, phone, message = '' } = req.body;

    try {
      const job = await Job.findById(jobId).lean();
      if (!job) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }

      // duplicate check
      const existing = await QuickApplication.findOne({ jobId, email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ success: false, error: 'Already applied' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Resume is required' });
      }

      const resumeUrl = `/uploads/resumes/${req.file.filename}`;
      const trackToken = crypto.randomBytes(24).toString('hex');
      const trackUrl = `http://localhost:5173/track?token=${encodeURIComponent(trackToken)}&email=${encodeURIComponent(email)}`;
      const apiBase = process.env.API_BASE_URL || 'http://localhost:5000';
      const resumeUrlFull = `${apiBase}${resumeUrl}`;

      // Generate PDF summary
      const pdfFilename = `summary-${trackToken}.pdf`;
      const pdfPath = path.join(pdfDir, pdfFilename);
      const pdfUrl = `/uploads/pdfs/${pdfFilename}`;
      await new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);
        doc.fontSize(18).fillColor('#0ea5a4').text('Application Summary', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).fillColor('#111').text(`Job Title: ${job.title}`);
        doc.text(`Company: ${job.company}`);
        doc.text(`Applicant: ${name}`);
        doc.text(`Email: ${email}`);
        doc.text(`Phone: ${phone}`);
        doc.text(`Message: ${message || 'N/A'}`);
        doc.text(`Applied: ${new Date().toLocaleString()}`);
        doc.text(`Application ID: ${trackToken}`);
        doc.text(`Track URL: ${trackUrl}`);
        doc.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      const application = await QuickApplication.create({
        jobId,
        name,
        email: email.toLowerCase(),
        phone,
        message,
        resumeUrl,
        status: 'Pending',
        trackToken,
        jobTitle: job.title || '',
        company: job.company || '',
        pdfUrl,
      });
      const pdfUrlFull = `${apiBase}${pdfUrl}`;

      // Send confirmation email (console fallback if SMTP missing)
      try {
        const appliedDate = new Date(application.createdAt).toLocaleString();
        const brandColor = '#0ea5a4';
        const htmlBody = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px; color:#111;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,0.06);">
    <div style="background:${brandColor};color:#fff;padding:16px 20px;font-size:18px;font-weight:700;">Job Portal</div>
    <div style="padding:20px;">
      <p style="font-size:16px;">Hi ${name},</p>
      <p>We’ve received your application for <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
      <p style="margin:12px 0;">Status: <strong>${application.status}</strong><br/>Applied: ${appliedDate}<br/>Application ID: ${application._id}</p>
      <a href="${trackUrl}" style="display:inline-block;background:${brandColor};color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;">Track my Application</a>
      <p style="margin-top:16px;font-size:12px;color:#555;">If the button doesn’t work, copy this link:<br/><span style="color:${brandColor};word-break:break-all;">${trackUrl}</span></p>
    </div>
    <div style="background:#f3f4f6;color:#4b5563;padding:14px 20px;font-size:12px;">
      Need help? Reply to this email${process.env.RECRUITER_EMAIL ? ` or contact ${process.env.RECRUITER_EMAIL}` : ''}.
    </div>
  </div>
</body>
</html>`;

        const { previewUrl } = await sendMail({
          from: process.env.EMAIL_FROM || 'no-reply@example.com',
          to: email,
          cc: process.env.RECRUITER_EMAIL || undefined,
          subject: `Application received — ${job.title} at ${job.company}`,
          text: `Hi ${name},

Your application for ${job.title} at ${job.company} has been received.
Status: ${application.status}
Applied: ${new Date(application.createdAt).toLocaleString()}
Track: ${trackUrl}
`,
          html: htmlBody,
          attachments: [
            {
              filename: 'Application-Summary.pdf',
              path: pdfPath,
              contentType: 'application/pdf',
            },
          ],
        });

        if (previewUrl && process.env.NODE_ENV !== 'production') {
          console.log('[mail] previewUrl:', previewUrl);
          application.previewUrl = previewUrl;
        }
      } catch (mailErr) {
        console.error('Quick apply mail error:', mailErr.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Application received',
        application: {
          id: application._id,
          jobId: application.jobId,
          status: application.status,
          resumeUrl: application.resumeUrl,
          resumeUrlFull,
          trackToken: application.trackToken,
          pdfUrl: application.pdfUrl,
          pdfUrlFull,
        },
        trackUrl,
        ...(application.previewUrl ? { previewUrl: application.previewUrl } : {}),
      });
    } catch (err) {
      console.error('Quick apply error:', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }
);

// Save/unsave a job for the current user
router.post('/:id/save', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        const user = await User.findById(req.user.id);
        const idStr = String(job._id);
        const exists = (user.savedJobs || []).some((j) => String(j) === idStr);
        const update = exists ? { $pull: { savedJobs: job._id } } : { $addToSet: { savedJobs: job._id } };
        await User.findByIdAndUpdate(req.user.id, update);
        res.json({ saved: !exists });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Employer: list own jobs
router.get('/mine/list', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
