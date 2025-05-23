const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', // Reference to Event model
        required: true
    },
    ticketsBooked: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;