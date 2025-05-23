const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
<<<<<<< Updated upstream:event-ticketing-backend/server.js
    

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
=======
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Import routes
const userRoutes = require('./Routes/userRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const authRoutes = require('./Routes/authRoutes');
>>>>>>> Stashed changes:BackEnd/Server.js

// Use routes
app.use('/api/auth', authRoutes); // Auth routes should be first
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Global error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
