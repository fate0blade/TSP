const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile.png', // Default profile picture URL
    },
    role: {
        type: String,
        enum: ['User', 'Organizer', 'Admin'],
        required: true,
        default: 'User',
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;