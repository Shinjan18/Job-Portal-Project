const jwt = require('jsonwebtoken');

const User = require('../models/User');

async function auth(req, res, next) {
	try {
		const header = req.headers.authorization || '';
		const token = req.cookies?.token || (header.startsWith('Bearer ') ? header.slice(7) : null);
		if (!token) return res.status(401).json({ message: 'Unauthorized' });

		const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');

		const user = await User.findById(payload.id);
		if (!user) return res.status(401).json({ message: 'User not found' });

		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

module.exports = auth;



