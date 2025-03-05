const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: 'https://example.com/default-image.png', 
    },
    price: {
        type: Number,
        required: true,
    },
    totalTickets: {
        type: Number,
        required: true,
    },
    remainingTickets: {
        type: Number,
        required: true,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
 }, { timestamps: true });

 const TicketTracker = mongoose.model('Event', EventSchema);

module.exports = TicketTracker;
