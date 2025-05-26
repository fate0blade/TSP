import { useState } from 'react';
import axios from 'axios';

const BookTicketForm = ({ eventId, maxTickets }) => {
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // You may want to fetch ticket price from parent or pass as prop
  // For this example, we'll assume parent passes ticket price as prop
  // If not, you can fetch event details here as well

  // Optionally, pass ticketPrice as a prop for accurate calculation
  // const ticketPrice = 50;

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > maxTickets) setQuantity(maxTickets);
    else if (val < 1) setQuantity(1);
    else setQuantity(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/bookings/${eventId}`,
        { ticketsBooked: quantity },
        { withCredentials: true }
      );
      setBooking(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Booking failed. Please try again.'
      );
    }
    setLoading(false);
  };

  if (booking) {
    return (
      <div className="mt-4 text-green-600 font-semibold">
        Booking successful! You booked {booking.ticketsBooked} ticket(s).
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <input
          type="number"
          min={1}
          max={maxTickets}
          value={quantity}
          onChange={handleChange}
          className="w-24 border rounded px-2 py-1"
        />
        <span className="ml-2 text-gray-500 text-sm">
          (Available: {maxTickets})
        </span>
      </div>
      {/* Optionally show total price if ticketPrice is available */}
      {/* <div>
        <span className="font-medium">Total Price:</span> ${quantity * ticketPrice}
      </div> */}
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        disabled={loading || maxTickets === 0}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Booking...' : 'Book'}
      </button>
    </form>
  );
};

export default BookTicketForm;