const Event = require('../Schema/Event_Schema'); // Import the Event schema

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
            { _id: eventId, organizer: req.user.id }, // Ensure the organizer owns the event
            { totalTickets, date, location, remainingTickets: totalTickets }, // Update remaining tickets if totalTickets changes
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

