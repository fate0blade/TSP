import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings', { withCredentials: true });
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
              <Link
                to="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li key={booking._id}>
                  <Link to={`/bookings/${booking._id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {booking.event.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(booking.event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Tickets: {booking.ticketsBooked}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          Total: ${booking.totalPrice}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookingsPage; 