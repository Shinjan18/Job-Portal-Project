const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { connect } = require('./db');
const { seedJobs } = require('./seed');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const profileRoutes = require('./routes/profile');
const applicationRoutes = require('./routes/applications');
const applyAliasRoutes = require('./routes/apply');
const staticRouter = require('./profile_static');
const { sendMail } = require('./utils/mailer');
const path = require('path');

const app = express();

// CORS configuration
const isDevelopment = process.env.NODE_ENV === 'development';

const corsOptions = {
  origin: isDevelopment 
    ? function (origin, callback) {
        // Allow all origins in development
        callback(null, true);
      }
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        process.env.CORS_ORIGIN
      ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Total-Count']
};

app.use(cors(corsOptions));
// Enable pre-flight for all routes - fixed the path issue
app.options(/.*/, cors(corsOptions));
// Body parser
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_FILE_SIZE || '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/apply', applyAliasRoutes);
app.use('/api', staticRouter);
// serve uploads (resumes/pdfs)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Secure download route
app.get('/api/uploads/download', (req, res) => {
  const { type, file } = req.query;
  if (!type || !file) return res.status(400).json({ success: false, message: 'type and file required' });
  if (!['resume', 'pdf'].includes(String(type))) return res.status(400).json({ success: false, message: 'invalid type' });
  const safeName = String(file);
  if (safeName.includes('..') || safeName.includes('/') || safeName.includes('\\')) {
    return res.status(400).json({ success: false, message: 'invalid filename' });
  }
  const baseDir = type === 'resume' ? 'resumes' : 'pdfs';
  const filePath = path.join(__dirname, '..', 'uploads', baseDir, safeName);
  return res.download(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') return res.status(404).json({ success: false, message: 'File not found' });
      console.error('Download error:', err);
      return res.status(500).json({ success: false, message: 'Error downloading file' });
    }
  });
});

// Test email route
app.get('/api/test-email', async (req, res) => {
  try {
    const email = req.query.email || 'test@example.com';
    const { previewUrl, transportType } = await sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      to: email,
      subject: 'Test Email - Job Portal',
      html: '<h2 style="color:#0ea5a4;">Job Portal</h2><p>This is a test email.</p>',
      text: 'Job Portal test email',
    });
    return res.json({ success: true, previewUrl, transport: transportType || 'unknown' });
  } catch (err) {
    console.error('Test email error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

connect().then(() => setTimeout(() => { seedJobs().catch(() => {}) }, 250));

module.exports = app;