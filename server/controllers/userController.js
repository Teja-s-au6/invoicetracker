const User = require('../models/User');
const { sign } = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
	signUp: async (req, res) => {
		try {
			const newUser = await User.create({ ...req.body });
			const token = sign({ id: newUser._id }, JWT_SECRET_KEY, { expiresIn: '24h' });
			newUser.accessToken = token;
			await newUser.save();
			res.status(200).json({
				message: 'sucessfully registered',
				data: newUser,
				token: token
			});
		} catch (err) {
			//console.log(err.message)
			res.status(400).json({ err: err.message });
		}
	},

	signIn: async (req, res) => {
		try {
			const { email, password } = req.body;
			const foundUser = await User.findByEmailAndPassword(email, password);
			if (!foundUser) return res.status(400).send('inavlid credentials');
			const token = await sign({ id: foundUser._id }, JWT_SECRET_KEY, { expiresIn: '24h' });
			foundUser.accessToken = token;
			await foundUser.save();
			return res.status(200).json({
				message: 'logged in successfully',
				data: foundUser,
				token: token
			});
		} catch (err) {
			//console.log(err.message)
			res.status(400).json({ err: err.message });
		}
	},

	signOut: async (req, res) => {
		try {
			const token = req.headers.authorization;
			const foundUser = await User.findOneAndUpdate({ accessToken: token }, { accessToken: null });
			if (!foundUser) return res.status(400).json({ message: 'invalid credentials' });
			return res.json({ message: 'loggedOut successfully' });
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
};
