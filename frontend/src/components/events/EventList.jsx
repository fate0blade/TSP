import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch only approved events
        const res = await axios.get('/api/events');
        setEvents(res.data);
      } catch (err) {
        setEvents([]);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Approved Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.length === 0 && (
          <div className="col-span-3 text-center text-gray-500">No events found.</div>
        )}
        {events.map(event => (
          <Link
            to={`/events/${event._id}`}
            key={event._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex flex-col"
          >
            <img
              src={event.imageUrl || '/default-event.jpg'}
              alt={event.title}
              className="h-48 w-full object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <div className="text-gray-600 mb-1">
              <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-medium">Location:</span> {event.location}
            </div>
            <div className="text-indigo-600 font-bold mt-auto">
              ${event.ticketPrice}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventList;