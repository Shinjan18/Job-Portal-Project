const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { upload } = require('../profile_upload');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/', auth, async (req, res) => {
	try {
		if (!req.user || !req.user.id) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const user = await User.findById(req.user.id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (err) {
		console.error('Profile error:', err);
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});

router.put(
	'/',
	auth,
	[
		body('name').optional().isString(),
		body('email').optional().isEmail(),
		body('phone').optional().isString(),
		body('location').optional().isString(),
		body('headline').optional().isString(),
		body('bio').optional().isString(),
		body('experience').optional().isString(),
		body('education').optional().isString(),
		body('skills').optional().isArray(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		try {
			const updates = req.body;
			const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select(
				'-password'
			);
			res.json(user);
	} catch (err) {
			res.status(500).json({ message: 'Server error' });
		}
	}
);

// Resume upload
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const url = `/api/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { resumeUrl: url } },
            { new: true }
        ).select('-password');
        res.json({ resumeUrl: url, user });
    } catch (err) {
        console.error('Resume upload error:', err);
        res.status(500).json({ message: 'Upload failed' });
    }
});

// Delete resume
router.delete('/resume', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $unset: { resumeUrl: "" } },
            { new: true }
        ).select('-password');
        res.json({ message: 'Resume deleted successfully', user });
    } catch (err) {
        console.error('Resume delete error:', err);
        res.status(500).json({ message: 'Delete failed' });
    }
});

// Update password
router.put('/password', auth, [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Password update error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update notification preferences
router.put('/notifications', auth, async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { notifications: preferences } },
            { new: true }
        ).select('-password');
        res.json({ message: 'Notification preferences updated', user });
    } catch (err) {
        console.error('Notification update error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;