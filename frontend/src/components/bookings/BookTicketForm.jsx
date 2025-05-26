import React, { useState } from 'react';
import axios from '../services/api';

const BookTicketForm = ({ eventId, price, available, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (quantity < 1 || quantity > available) {
      return alert('Invalid quantity selected.');
    }

    try {
      setLoading(true);
      await axios.post('/bookings', { eventId, quantity });
      alert('Booking successful');
      onSuccess?.();
    } catch (error) {
      alert('Booking failed: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Book Tickets</h3>
      <label>
        Quantity:
        <input
          type="number"
          min="1"
          max={available}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>
      <p>Total Price: ${quantity * price}</p>
      <button onClick={handleBook} disabled={loading}>
        {loading ? 'Booking...' : 'Book'}
      </button>
    </div>
  );
};

export default BookTicketForm;
