const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Upload file
router.post('/', uploadController.uploadFile);

// Get all files
router.get('/', uploadController.getAllFiles);

// Delete a file
router.delete('/:id', uploadController.deleteFile);

module.exports = router;