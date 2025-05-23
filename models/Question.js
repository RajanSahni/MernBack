const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    level: { type: Number, required: true },
    age_group: { type: Number, required: true },
    question_type: { type: String, required: true },
    title: { type: String },
    titlefile: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    options: [optionSchema],
    correct_answer: { type: String, required: true },
    explanation: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deployedTo: { type: String, enum: ['Hindi', 'Math', 'Science', 'English'], default: null }
});

questionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Question', questionSchema);