import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const statusOptions = ['all', 'approved', 'pending', 'declined'];

const AdminEventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/events/all', { withCredentials: true });
        setEvents(res.data);
      } catch (err) {
        setError('Failed to fetch events');
      }
      setLoading(false);
    };
    if (user && user.role === 'Admin') {
      fetchEvents();
    }
  }, [user]);

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await axios.patch(`/api/events/${eventId}/status`, { status: newStatus }, { withCredentials: true });
      setEvents(events =>
        events.map(ev =>
          ev._id === eventId ? { ...ev, Status: newStatus } : ev
        )
      );
    } catch (err) {
      alert('Failed to update event status');
    }
  };

  if (!user || user.role !== 'Admin') {
    return <div className="text-center text-red-500 mt-8">Access denied. Admin only.</div>;
  }

  if (loading) {
    return <div className="text-center mt-8">Loading events...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">All Events</h1>
      <div className="mb-4 flex gap-2">
        {statusOptions.map(opt => (
          <button
            key={opt}
            className={`px-3 py-1 rounded ${filter === opt ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFilter(opt)}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Organizer</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events
              .filter(ev => filter === 'all' || ev.Status === filter)
              .map(ev => (
                <tr key={ev._id} className="border-t">
                  <td className="px-4 py-2">{ev.title}</td>
                  <td className="px-4 py-2">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{ev.location}</td>
                  <td className="px-4 py-2">{ev.organizer?.name || 'N/A'}</td>
                  <td className="px-4 py-2">{ev.Status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {ev.Status !== 'approved' && (
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        onClick={() => handleStatusChange(ev._id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {ev.Status !== 'declined' && (
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        onClick={() => handleStatusChange(ev._id, 'declined')}
                      >
                        Decline
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEventsPage;