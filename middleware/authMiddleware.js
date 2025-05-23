

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Get token from header (support both Authorization and x-auth-token)
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-auth-token');

    if (!token) {
        console.log('No token found in headers:', req.headers);
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Optional: Check token expiration manually
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ message: 'Token has expired' });
        }

        // Check if token structure is valid
        if (!decoded.user || !decoded.user.id) {
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;
