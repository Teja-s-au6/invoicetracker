const { verify } = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET_KEY } = process.env;
module.exports = {
	verifyUser: async (req, res, next) => {
		try {
			token = req.headers.authorization;
			if (!token) return res.status(400).json({ message: 'token needed' });
			const isVerified = await verify(token, JWT_SECRET_KEY);
			const user = await User.findOne({ _id: isVerified.id });
			req.user = user;
			if (!isVerified) return res.status(400).json({ message: 'invalid credentials' });
			next();
		} catch (err) {
			res.status(500).json({ message: 'Server Error' });
		}
	},

	verifyAdmin: async (req, res, next) => {
		try {
			token = req.headers.authorization;
			if (!token) return res.status(400).json({ message: 'token needed' });
			const isVerified = await verify(token, JWT_SECRET_KEY);
			const user = await User.findOne({ _id: isVerified.id });
			if (user.role === 'admin') {
				req.user = user;
				next();
			} else {
				res.status(400).json({ message: 'You dont have permission' });
			}
		} catch (err) {
			res.status(500).json({ message: 'Server Error' });
		}
	}
};
