const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { connect } = require('./db');
const { seedJobs } = require('./seed');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const profileRoutes = require('./routes/profile');
const applicationRoutes = require('./routes/applications');
const applyAliasRoutes = require('./routes/apply');
const staticRouter = require('./profile_static');

const app = express();

// ======================
// 1. CORS Configuration
// ======================
const allowedOrigins = [
  'http://localhost:5173',
  'https://job-portal-frontend-omega.vercel.app',
  'https://job-portal-project-in8xmxtwx-shinjan-vermas-projects.vercel.app',
  process.env.CLIENT_ORIGIN
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ======================
// 2. Middleware
// ======================
app.use(cors(corsOptions)); // Single CORS middleware for all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// ======================
// 3. Static Files
// ======================
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    }
  }
}));

// ======================
// 4. Routes
// ======================
// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Job Portal Backend API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      jobs: '/api/jobs',
      health: '/api/health',
      quickApply: '/api/jobs/:id/quick-apply',
      uploads: '/uploads/[filename]'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// ======================
// 5. API Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/apply', applyAliasRoutes);
app.use('/api', staticRouter);

// ======================
// 6. Error Handling
// ======================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Resource not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

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