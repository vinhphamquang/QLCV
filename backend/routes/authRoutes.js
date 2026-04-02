const express = require('express');
const router = express.Router();
// Import controller
const authController = require('../controllers/authController');

// Đường dẫn: /api/auth/register
router.post('/register', authController.register);

// Đường dẫn: /api/auth/login
router.post('/login', authController.login);

// Đường dẫn: /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

router.post('/verify-recovery', authController.verifyRecoveryInfo);

router.post('/verify-system-secret', authController.verifySystemSecret);

module.exports = router;