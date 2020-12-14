const User = require('../models/User');
const Invoice = require('../models/Invoice');
const bufferToString = require('../utils/bufferToString');
const cloudinary = require('../utils/cloudinary');

module.exports = {
	invoiceCreated: async (req, res) => {
		try {
			const user = req.user;
            const body = JSON.parse(req.body.data);
            const { originalname, buffer } = req.file;
			const createInvoice = await Invoice.create({
				...body,
				user: user._id
            });
            const imageContent = bufferToString(originalname, buffer);
            const { secure_url } = await cloudinary.uploader.upload(imageContent);
			createInvoice.image = secure_url;
			await createInvoice.save();
			user.invoices.push(createInvoice._id);
			await user.save();
			res.status(201).json({ YourInvoice: createInvoice });
		} catch (err) {
			console.error(err);
			res.status(400).json({ err: err.message });
		}
	},

	invoiceUpdated: async (req, res) => {
		try {
			const id = req.params.invoiceId;
			const body = JSON.parse(req.body.data);
			const updateInvoice = await Invoice.findOneAndUpdate({ _id: id }, { ...body });
			const { originalname, buffer } = req.file;
			const imageContent = bufferToString(originalname, buffer);
			const { secure_url } = await cloudinary.uploader.upload(imageContent);
			updateInvoice.image = secure_url;
			await updateInvoice.save();
			res.status(200).json({ YourInvoice: updateInvoice });
		} catch (err) {
			console.error(err);
			res.status(400).json({ err: err.message });
		}
	},

	invoiceDeleted: async (req, res) => {
		try {
            const user = req.user;
			const id = req.params.invoiceId;
			const foundInvoice = await Invoice.findByIdAndDelete({ _id: id }).populate('user');
			await User.findByIdAndUpdate({ _id: foundInvoice.user._id }, { $pull: { invoices: foundInvoice._id } });
			const invoices = await User.find({_id : user._id}).populate('invoice');
			res.status(200).json({ YourInvoice: invoices });
		} catch (err) {
			console.error(err);
			res.status(400).json({ err: err.message });
		}
	},

	approveInvoice: async (req, res) => {
		try {
			const id = req.params.invoiceId;
			const approveInvoice = await Invoice.findOneAndUpdate({ _id: id }, { approved: true, pending: false });
			res.status(200).json({ YourInvoice: approveInvoice });
		} catch (err) {
			console.error(err);
			res.status(400).json({ err: err.message });
		}
	},

	rejectInvoice: async (req, res) => {
		try {
			const id = req.params.invoiceId;
			const rejectInvoice = await Invoice.findOneAndUpdate({ _id: id }, { rejected: true, pending: false });
			res.status(200).json({ YourInvoice: rejectInvoice });
		} catch (err) {
			console.error(err);
			res.status(400).json({ err: err.message });
		}
	},

	getUserInvoice: async (req, res) => {
		try {
			const user = req.user;
			const userInvoices = await Invoice.find({ user: user._id });
			res.status(200).json({ data: userInvoices });
		} catch (err) {
			console.error(err);
			res.status(400).json({ err: err.message });
		}
	}
};
