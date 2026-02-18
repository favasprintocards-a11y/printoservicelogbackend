const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/authController.js');
const { protect, admin } = require('../middleware/authMiddleware.js'); // protect used if we want protected registration

router.post('/login', authUser);
router.post('/register', registerUser); // Open registration for initial setup, or protect it later

module.exports = router;
