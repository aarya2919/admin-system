const express = require('express');
const router = express.Router();

const { updateMentorStatus } = require('../controllers/adminController');

// Admin approves or rejects mentor
router.put('/mentor/status', updateMentorStatus);

module.exports = router;