const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

const questionController = require('../controllers/questionController');

const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a question
router.post('/', questionController.createQuestion);

// Get all questions
router.get('/', questionController.getAllQuestions);

// Get a single question
router.get('/:id', questionController.getQuestion);

// Update a question
router.put('/:id', questionController.updateQuestion);

// Delete a question
router.delete('/:id', questionController.deleteQuestion);




router.get('/subject/:subject', authMiddleware, async (req, res) => {
    try {
      const { subject } = req.params;
  
      if (!['Hindi', 'Math', 'Science', 'English'].includes(subject)) {
        return res.status(400).json({ message: 'Invalid subject.' });
      }
  
      const questions = await Question.find({ deployedTo: subject });
  
      res.status(200).json({ questions });
    } catch (error) {
      console.error('Error fetching by subject:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  



module.exports = router;