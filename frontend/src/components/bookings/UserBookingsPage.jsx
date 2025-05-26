import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/bookings', { withCredentials: true });
        setBookings(res.data);
      } catch (err) {
        setError('Failed to fetch bookings');
      }
      setLoading(false);
    };
    if (user) fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.delete(`/api/bookings/${bookingId}`, { withCredentials: true });
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  if (!user) {
    return <div className="text-center text-red-500 mt-8">Please log in to view your bookings.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {bookings.length === 0 ? (
        <div className="text-gray-500">You have not made any bookings yet.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold">{booking.event?.title || 'Event'}</div>
                <div className="text-gray-600 text-sm">
                  Quantity: <span className="font-medium">{booking.ticketsBooked}</span>
                </div>
                <div className="text-gray-600 text-sm">
                  Total Price: <span className="font-medium">${booking.totalPrice}</span>
                </div>
              </div>
              <button
                className="mt-2 md:mt-0 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleCancel(booking._id)}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;