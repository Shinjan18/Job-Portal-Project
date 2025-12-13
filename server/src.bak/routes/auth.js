const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/signup',
    [
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        body('role').optional().isIn(['jobseeker', 'employer'])
    ],
    async (req, res) => {
        const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
            const { name, email, password, role } = req.body;
            try {
                let user = await User.findOne({ email });
                if (user) return res.status(409).json({ success: false, message: 'Email already registered' });
                const hash = await bcrypt.hash(password, 10);
                user = await User.create({ name, email, password: hash, role: role || 'jobseeker' });
                
                // Generate token like in login
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecretjwtkey', {
                    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
                });
                
                res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
                return res.status(201).json({ 
                    success: true, 
                    token, 
                    user: { id: user._id, name: user.name, email: user.email, role: user.role },
                    message: 'Signup successful' 
                });
            } catch (err) {
                console.error('Signup error:', err);
                return res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
            }
    }
);

router.post(
	'/login',
	[body('email').isEmail(), body('password').notEmpty()],
	async (req, res) => {
			const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email }).select('+password');
			if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
			const ok = await bcrypt.compare(password, user.password);
			if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecretjwtkey', {
				expiresIn: process.env.JWT_EXPIRES_IN || '7d'
			});
			res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
            return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
		} catch (err) {
			console.error('Login error:', err);
			return res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
		}
	}
);

router.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.json({ message: 'Logged out' });
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json({ user });
	} catch (err) {
		console.error('Error fetching user:', err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Forgot/Reset password (dev-friendly: returns token for testing)
router.post('/forgot', [body('email').isEmail()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If email exists, reset link sent' });
    const token = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 24);
    user.resetToken = token;
    user.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await user.save();
    return res.json({ message: 'Reset link generated', token });
});

router.post(
    '/reset',
    [body('token').notEmpty(), body('password').isLength({ min: 6 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const { token, password } = req.body;
        const user = await User.findOne({ resetToken: token, resetTokenExpiresAt: { $gt: new Date() } }).select('+password');
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        await user.save();
        return res.json({ message: 'Password reset successful' });
    }
);

module.exports = router;



