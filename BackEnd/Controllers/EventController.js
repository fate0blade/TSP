const Event = require('../Models/event.js'); // Import the Event schema

// 1. View all posted events (accessible to anyone)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ Status: 'approved' }); // Fetch only approved events
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

// 2. Post a new event (restricted to organizers)
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, image, price, totalTickets } = req.body;
        const organizerId = req.user.id;

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            category,
            image,
            price,
            totalTickets,
            remainingTickets: totalTickets,
            organizer: organizerId,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

// 3. Edit an event (restricted to organizers)
exports.editEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { totalTickets, date, location } = req.body;

        const updatedEvent = await Event.findOneAndUpdate(
            { _id: eventId, organizer: req.user.id },
            { totalTickets, date, location, remainingTickets: totalTickets },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found or not authorized' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
};

// 4. Delete an event (restricted to organizers)
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const deletedEvent = await Event.findOneAndDelete({
            _id: eventId,
            organizer: req.user.id,
        });

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found or not authorized' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};

// 5. View event analytics (restricted to organizers)
exports.getEventAnalytics = async (req, res) => {
    try {
        const organizerId = req.user.id;

        const events = await Event.find({ organizer: organizerId });
        const analytics = events.map(event => ({
            title: event.title,
            percentageBooked: (((event.totalTickets - event.remainingTickets) / event.totalTickets) * 100).toFixed(2),
        }));

        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error });
    }
};

// 6. Approve or reject an event (restricted to admins)
exports.updateEventStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { Status } = req.body;

        if (!['approved', 'pending', 'declined'].includes(Status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { Status },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event status', error });
    }
};



