const { Router } = require('express');
const router = Router();
const { signUp, signIn, signOut } = require('../controllers/userController');
const { verifyUser } = require('../middleware/authenticate');


router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.delete('/signOut', verifyUser, signOut);

module.exports = router;
