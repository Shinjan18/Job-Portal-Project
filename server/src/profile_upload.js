const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname || '').slice(0, 10);
        cb(null, `resume-${unique}${ext || '.pdf'}`);
    }
});

const upload = multer({ storage });

module.exports = { upload, uploadsDir };



