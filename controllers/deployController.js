const Question = require('../models/Question');

exports.deployQuestions = async (req, res) => {
  try {
    const { subject, questionIds } = req.body;

    if (!subject || !questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: "Subject and question IDs are required." });
    }

    if (!['Hindi', 'Math', 'Science', 'English'].includes(subject)) {
      return res.status(400).json({ message: "Invalid subject." });
    }

    const result = await Question.updateMany(
      { _id: { $in: questionIds } },
      { $set: { deployedTo: subject } }
    );

    res.status(200).json({
      message: `Successfully deployed ${result.modifiedCount} questions to ${subject}.`,
    });
  } catch (error) {
    console.error("Deploy error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
