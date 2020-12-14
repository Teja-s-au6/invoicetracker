const { Router } = require('express');
const router = Router();
const {
	invoiceCreated,
	invoiceUpdated,
	invoiceDeleted,
	approveInvoice,
	rejectInvoice
} = require('../controllers/apiController');
const { verifyUser, verifyAdmin } = require('../middleware/authenticate');
const upload = require("../utils/multer");

router.post('/createInvoice', upload.single('image'), verifyUser, invoiceCreated);

router.patch('/updateInvoice/:invoiceId', upload.single('image'), verifyUser, invoiceUpdated);

router.delete('/deleteInvoice/:invoiceId', verifyUser, invoiceDeleted);

router.patch('/approveInvoice', verifyAdmin, approveInvoice);

router.patch('/rejectInvoice', verifyAdmin, rejectInvoice);

module.exports = router;
