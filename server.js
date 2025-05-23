

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-auth-token',
    'x-requested-with'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// Additional headers middleware for credentials
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, x-auth-token'
  );
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload middleware with enhanced configuration
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  abortOnLimit: true,
  useTempFiles: false,
  tempFileDir: '/tmp/',
  safeFileNames: true,
  preserveExtension: true
}));

// MongoDB connection with modern options
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/auth-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/deploy', require('./routes/deployRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS configured for origins: ${corsOptions.origin.join(', ')}`);
});