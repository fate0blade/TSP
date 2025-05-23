import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

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
          {/* Event Image */}
          <div className="relative h-96">
            <img
              src={event.imageUrl || '/default-event.jpg'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40">
              <div className="h-full flex items-end">
                <div className="p-8">
                  <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                  <div className="flex items-center text-white space-x-4">
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">About this Event</h2>
                <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Category</h4>
                      <p className="text-gray-600">{event.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Organizer</h4>
                      <p className="text-gray-600">{event.organizer.name}</p>
                    </div>
                    {event.additionalInfo && (
                      <div>
                        <h4 className="font-medium text-gray-900">Additional Information</h4>
                        <p className="text-gray-600">{event.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Information */}
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Tickets</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price</span>
                      <span className="text-2xl font-bold text-indigo-600">${event.ticketPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        event.ticketsAvailable > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {event.ticketsAvailable > 0 ? `${event.ticketsAvailable} tickets left` : 'Sold out'}
                      </span>
                    </div>
                    {event.ticketsAvailable > 0 && (
                      <button
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                        onClick={() => navigate(`/events/${id}/tickets`)}
                      >
                        Get Tickets
                      </button>
                    )}
                  </div>
                </div>

                {/* Event Status (for organizers and admins) */}
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Event Status</h3>
                    <div className={`px-4 py-2 rounded-md ${
                      event.status === 'approved' ? 'bg-green-100 text-green-800' :
                      event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </div>
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