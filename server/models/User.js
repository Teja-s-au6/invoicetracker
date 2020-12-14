const { Schema, model } = require('mongoose');
const { hash, compare } = require('bcrypt');

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 5
		},
		role: {
			type: String,
			default: 'user',
			trim: true
		},
		accessToken: {
			type: String,
			required: false
		},
		invoices : [{
			type: Schema.Types.ObjectId,
			ref: "invoice"
		}]
	},
	{ timestamps: true }
);

userSchema.statics.findByEmailAndPassword = async (email, password) => {
	try {
		const foundUser = await User.findOne({ email });
		if (!foundUser) throw new Error('Incorrect credentials');
		const isMatched = await compare(password, foundUser.password);
		if (!isMatched) throw new Error('incorrect credentials');
		return foundUser;
	} catch (error) {
		error.name = 'AuthError';
		throw error;
	}
};

userSchema.pre('save', async function(next) {
	const user = this;
	try {
		if (user.isModified('password')) {
			const hashedPassword = await hash(user.password, 10);
			user.password = hashedPassword;
			next();
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

const User = model('user', userSchema);
module.exports = User;
