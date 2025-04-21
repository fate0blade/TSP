const Booking = require('../Schema/Booking_schema'); // Import the Booking schema
const Event = require('../Schema/Event_Schema'); // Import the Event schema

// 1. Create a Booking
exports.createBooking = async (req, res) => {
    try {
        const { eventId, ticketsBooked } = req.body;
        const userId = req.user.id; 

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.remainingTickets < ticketsBooked) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        const totalPrice = ticketsBooked * event.price;

        const newBooking = new Booking({
            user: userId,
            event: eventId,
            ticketsBooked,
            totalPrice,
        });

        const savedBooking = await newBooking.save();

        event.remainingTickets -= ticketsBooked;
        await event.save();

        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
};

// 2. View User's Bookings
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info

        const bookings = await Booking.find({ user: userId }).populate('event', 'title date location');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

// 3. Cancel a Booking
exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId).populate('event');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        const event = booking.event;
        event.remainingTickets += booking.ticketsBooked;
        await event.save();

        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling booking', error });
    }
};

// 4. Admin View of All Bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name email').populate('event', 'title date location');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};