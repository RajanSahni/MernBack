const path = require('path');
const fs = require('fs');
const File = require('../models/File');

// Upload file
exports.uploadFile = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No files were uploaded' 
            });
        }

        const file = req.files.file;
        const uploadDir = path.join(__dirname, '../uploads');

        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, filename);

        // Save file to disk
        await file.mv(filePath);

        // Save file info to database
        const savedFile = new File({
            filename: filename,
            path: `/uploads/${filename}`,
            mimetype: file.mimetype,
            size: file.size,
            uploadedBy: req.user.id
        });

        await savedFile.save();

        res.status(201).json({ 
            success: true, 
            data: savedFile 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Get all files
exports.getAllFiles = async (req, res) => {
    try {
        const files = await File.find().populate('uploadedBy', 'username email');
        res.status(200).json({ 
            success: true, 
            data: files 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Delete a file
exports.deleteFile = async (req, res) => {
    try {
        const file = await File.findByIdAndDelete(req.params.id);
        
        if (!file) {
            return res.status(404).json({ 
                success: false, 
                message: 'File not found' 
            });
        }
        
        // Delete file from disk
        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
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