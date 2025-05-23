const Question = require('../models/Question');
const File = require('../models/File');

// Create a new question
exports.createQuestion = async (req, res) => {
    try {
        const { titlefile, ...questionData } = req.body;
        
        // If there are files, verify they exist
        if (titlefile && titlefile.length > 0) {
            const files = await File.find({ _id: { $in: titlefile } });
            if (files.length !== titlefile.length) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'One or more files not found' 
                });
            }
        }

        const question = new Question({
            ...questionData,
            titlefile,
            createdBy: req.user.id
        });

        await question.save();
        
        res.status(201).json({ 
            success: true, 
            data: question 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('titlefile')
            .populate('createdBy', 'username email');
            
        res.status(200).json({ 
            success: true, 
            data: questions 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Get a single question
exports.getQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('titlefile')
            .populate('createdBy', 'username email');
            
        if (!question) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: question 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Update a question
exports.updateQuestion = async (req, res) => {
    try {
        const { titlefile, ...updateData } = req.body;
        
        // Check if question exists
        let question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question not found' 
            });
        }
        
        // Verify files if they are being updated
        if (titlefile && titlefile.length > 0) {
            const files = await File.find({ _id: { $in: titlefile } });
            if (files.length !== titlefile.length) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'One or more files not found' 
                });
            }
            updateData.titlefile = titlefile;
        }
        
        question = await Question.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        ).populate('titlefile');
        
        res.status(200).json({ 
            success: true, 
            data: question 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        
        if (!question) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: {} 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};