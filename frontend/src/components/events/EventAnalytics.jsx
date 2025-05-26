import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const EventAnalytics = ({ eventId }) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Replace with your backend analytics endpoint
        const res = await axios.get(`/api/events/${eventId}/analytics`, { withCredentials: true });
        setData(res.data); // Expected: [{ date: '2024-06-01', tickets: 5 }, ...]
      } catch (err) {
        setError('Failed to fetch analytics');
      }
      setLoading(false);
    };
    if (user && user.role === 'Organizer') {
      fetchAnalytics();
    }
  }, [eventId, user]);

  if (!user || user.role !== 'Organizer') {
    return <div className="text-center text-red-500 mt-8">Access denied. Organizer only.</div>;
  }

  if (loading) {
    return <div className="text-center mt-8">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Ticket Bookings Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventAnalytics;

<EventAnalytics eventId={event._id} />