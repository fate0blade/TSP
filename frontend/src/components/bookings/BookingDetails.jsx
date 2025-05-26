import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BookingDetails = () => {
  const { id } = useParams(); // booking id
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/api/bookings/${id}`, { withCredentials: true });
        setBooking(res.data);
      } catch (err) {
        setError('Failed to fetch booking details');
      }
      setLoading(false);
    };
    if (user) fetchBooking();
  }, [id, user]);

  if (!user) {
    return <div className="text-center text-red-500 mt-8">Please log in to view booking details.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center text-red-500 mt-8">
        {error || 'Booking not found.'}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <button
        className="mb-4 text-indigo-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
        <div className="mb-2">
          <span className="font-medium">Event:</span> {booking.event?.title || 'Event'}
        </div>
        <div className="mb-2">
          <span className="font-medium">Date:</span> {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}
        </div>
        <div className="mb-2">
          <span className="font-medium">Location:</span> {booking.event?.location || 'N/A'}
        </div>
        <div className="mb-2">
          <span className="font-medium">Tickets Booked:</span> {booking.ticketsBooked}
        </div>
        <div className="mb-2">
          <span className="font-medium">Total Price:</span> ${booking.totalPrice}
        </div>
        <div className="mb-2">
          <span className="font-medium">Booked At:</span> {new Date(booking.createdAt).toLocaleString()}
        </div>
        <div className="mb-2">
          <span className="font-medium">Booking ID:</span> {booking._id}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;