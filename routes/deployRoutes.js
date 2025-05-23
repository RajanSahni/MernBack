const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { deployQuestions } = require('../controllers/deployController');

router.post('/', auth, deployQuestions);

module.exports = router;
