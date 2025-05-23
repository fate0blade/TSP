const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateUser = async (req, res, next) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check if user has required role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized to access this route' });
        }
        next();
    };
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// Middleware to check if user is an organizer
const isOrganizer = (req, res, next) => {
    if (req.user && (req.user.role === 'Organizer' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Organizer access required' });
    }
};

// Middleware to check if user is accessing their own resource or is an admin
const isOwnerOrAdmin = (paramName = 'userId') => {
    return (req, res, next) => {
        const resourceId = req.params[paramName];
        if (
            req.user && (
                req.user._id.toString() === resourceId ||
                req.user.role === 'Admin'
            )
        ) {
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized access' });
        }
    };
};

module.exports = {
    authenticateUser,
    authorizeRoles,
    isAdmin,
    isOrganizer,
    isOwnerOrAdmin
};
