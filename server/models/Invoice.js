const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInvoices = new Schema({
	name: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	amount: {
		type: String,
		required: true
	},
	image: {
		type: String,
	},
	approved: {
		type: Boolean,
		default: false
	},
	pending: {
		type: Boolean,
		default: true
	},
	rejected: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	}
});

const userInvoice = mongoose.model('invoice', userInvoices);

module.exports = userInvoice;
