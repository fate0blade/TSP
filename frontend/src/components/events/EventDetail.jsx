import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import BookTicketForm from '../bookings/BookTicketForm';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch event details');
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image Section */}
          <div className="relative h-96">
            <img
              src={event.imageUrl || '/default-event.jpg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="h-full flex flex-col justify-end p-8">
                <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-white">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    ${event.ticketPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Event Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">About this Event</h2>
                <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Event Details</h3>
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="font-medium text-gray-900">Category</dt>
                    <dd className="text-gray-600">{event.category}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">Organizer</dt>
                    <dd className="text-gray-600">{event.organizer?.name}</dd>
                  </div>
                  {event.additionalInfo && (
                    <div>
                      <dt className="font-medium text-gray-900">Additional Information</dt>
                      <dd className="text-gray-600">{event.additionalInfo}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Ticket Section */}
            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h3 className="text-xl font-semibold mb-4">Tickets</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per ticket</span>
                  <span className="text-2xl font-bold text-indigo-600">${event.ticketPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available tickets</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    event.ticketsAvailable > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {event.ticketsAvailable}
                  </span>
                </div>

                {/* Booking Form */}
                {user ? (
                  event.ticketsAvailable > 0 ? (
                    <BookTicketForm event={event} />
                  ) : (
                    <p className="text-red-600 text-center font-medium">Sold Out</p>
                  )
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">Please log in to book tickets</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                      Log In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;