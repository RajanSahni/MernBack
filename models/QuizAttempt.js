// models/QuizAttempt.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question', 
    required: true 
  },
  selectedOptionIndex: { 
    type: Number, 
    required: true 
  },
  isCorrect: { 
    type: Boolean, 
    required: true 
  }
});

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {  // Using the name from the User model
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Hindi', 'Math', 'Science', 'English']
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);