import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const MyEventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get('/api/events/organizer/events', { withCredentials: true });
        setEvents(res.data);
      } catch (err) {
        setError('Failed to fetch your events');
      }
      setLoading(false);
    };
    if (user && user.role === 'Organizer') {
      fetchMyEvents();
    }
  }, [user]);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/api/events/${eventId}`, { withCredentials: true });
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (!user || user.role !== 'Organizer') {
    return (
      <div className="text-center text-red-500 mt-8">
        Access denied. Organizer only.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 && (
          <div className="col-span-2 text-center text-gray-500">You have not created any events.</div>
        )}
        {events.map(event => (
          <div key={event._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <img
              src={event.imageUrl || '/default-event.jpg'}
              alt={event.title}
              className="h-40 w-full object-cover rounded mb-3"
            />
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <div className="text-gray-600 mb-1">
              <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-medium">Location:</span> {event.location}
            </div>
            <div className="text-indigo-600 font-bold mb-2">
              ${event.ticketPrice}
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => navigate(`/events/edit/${event._id}`)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleDelete(event._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          to="/events/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Create New Event
        </Link>
      </div>
    </div>
  );
};

export default MyEventsPage;