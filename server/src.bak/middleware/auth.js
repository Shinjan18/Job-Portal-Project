const jwt = require('jsonwebtoken');

function auth(req, res, next) {
	try {
		const header = req.headers.authorization || '';
		const token = req.cookies?.token || (header.startsWith('Bearer ') ? header.slice(7) : null);
		if (!token) return res.status(401).json({ message: 'Unauthorized' });
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');
		req.user = { id: payload.id };
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}

module.exports = auth;



