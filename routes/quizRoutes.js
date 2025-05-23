// // routes/quizRoutes.js
// const express = require('express');
// const router = express.Router();
// const QuizAttempt = require('../models/QuizAttempt');
// const authMiddleware = require('../middleware/authMiddleware');

// router.use(authMiddleware);

// // Save quiz attempt
// router.post('/submit', async (req, res) => {
//   try {
//     const { subject, answers, score, totalQuestions } = req.body;
    
//     if (!subject || !answers || score === undefined || !totalQuestions) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const newQuizAttempt = new QuizAttempt({
//       user: req.user.id,
//       subject,
//       answers,
//       score,
//       totalQuestions
//     });

//     await newQuizAttempt.save();
    
//     res.status(201).json({ 
//       success: true, 
//       message: 'Quiz attempt saved successfully',
//       quizAttempt: newQuizAttempt
//     });
//   } catch (error) {
//     console.error('Error saving quiz attempt:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Get user's quiz attempts
// router.get('/attempts', async (req, res) => {
//   try {
//     const quizAttempts = await QuizAttempt.find({ user: req.user.id })
//       .sort({ completedAt: -1 });
    
//     res.status(200).json({ quizAttempts });
//   } catch (error) {
//     console.error('Error fetching quiz attempts:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;






// // routes/quizRoutes.js
// const express = require('express');
// const router = express.Router();
// const QuizAttempt = require('../models/QuizAttempt');
// const User = require('../models/User'); // Import the User model
// const authMiddleware = require('../middleware/authMiddleware');

// router.use(authMiddleware);

// // Save quiz attempt
// router.post('/submit', async (req, res) => {
//   try {
//     const { subject, answers, score, totalQuestions } = req.body;
    
//     if (!subject || !answers || score === undefined || !totalQuestions) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Fetch the user to get their name
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const newQuizAttempt = new QuizAttempt({
//       user: req.user.id,
//       userName: user.name, // Use the existing name field from the User model
//       subject,
//       answers,
//       score,
//       totalQuestions
//     });

//     await newQuizAttempt.save();
    
//     res.status(201).json({ 
//       success: true, 
//       message: 'Quiz attempt saved successfully',
//       quizAttempt: newQuizAttempt
//     });
//   } catch (error) {
//     console.error('Error saving quiz attempt:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Get user's quiz attempts
// router.get('/attempts', async (req, res) => {
//   try {
//     const quizAttempts = await QuizAttempt.find({ user: req.user.id })
//       .sort({ completedAt: -1 });
    
//     res.status(200).json({ quizAttempts });
//   } catch (error) {
//     console.error('Error fetching quiz attempts:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Get all quiz attempts (admin only)
// router.get('/all-attempts', async (req, res) => {
//   try {
//     // Check if user is admin
//     const user = await User.findById(req.user.id);
//     if (!user || user.role !== 'Admin') {
//       return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
//     }

//     const quizAttempts = await QuizAttempt.find()
//       .sort({ completedAt: -1 });
    
//     res.status(200).json({ quizAttempts });
//   } catch (error) {
//     console.error('Error fetching all quiz attempts:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;








  
// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User'); // Import the User model
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);


// Save quiz attempt (with single attempt restriction)
router.post('/submit', async (req, res) => {
    try {
      const { subject, answers, score, totalQuestions } = req.body;
      
      if (!subject || !answers || score === undefined || !totalQuestions) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Check if user already attempted this subject
      const existingAttempt = await QuizAttempt.findOne({
        user: req.user.id,
        subject: subject
      });
  
      if (existingAttempt) {
        return res.status(403).json({
          success: false,
          message: `You have already attempted the ${subject} quiz. Multiple attempts are not allowed.`
        });
      }
  
      // Fetch the user to get their name
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create new attempt
      const newQuizAttempt = new QuizAttempt({
        user: req.user.id,
        userName: user.name,
        subject,
        answers,
        score,
        totalQuestions,
        attemptNumber: 1 // Always 1 since only one attempt allowed
      });
  
      await newQuizAttempt.save();
  
      res.status(201).json({ 
        success: true, 
        message: 'Quiz attempt saved successfully',
        quizAttempt: newQuizAttempt
      });
  
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Get user's quiz attempts
router.get('/attempts', async (req, res) => {
  try {
    const quizAttempts = await QuizAttempt.find({ user: req.user.id })
      .sort({ completedAt: -1 });
    
    res.status(200).json({ quizAttempts });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all quiz attempts (admin only)
router.get('/all-attempts', async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
    }

    const quizAttempts = await QuizAttempt.find()
      .sort({ completedAt: -1 });
    
    res.status(200).json({ quizAttempts });
  } catch (error) {
    console.error('Error fetching all quiz attempts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;