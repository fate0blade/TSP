import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EventForm = ({ initialValues = {}, onSubmit, isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    date: initialValues.date ? initialValues.date.slice(0, 10) : '',
    time: initialValues.time || '',
    location: initialValues.location || '',
    category: initialValues.category || '',
    ticketPrice: initialValues.ticketPrice || '',
    totalTickets: initialValues.totalTickets || '',
    imageUrl: initialValues.imageUrl || '',
    additionalInfo: initialValues.additionalInfo || ''
  });

  useEffect(() => {
    if (isEditing) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`, { withCredentials: true });
      const event = response.data;
      const [date, time] = new Date(event.date).toISOString().split('T');
      setFormData({
        ...event,
        date,
        time: time.substring(0, 5)
      });
    } catch (err) {
      setError('Failed to fetch event details');
      console.error('Error fetching event:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const eventData = {
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        ticketPrice: parseFloat(formData.ticketPrice),
        totalTickets: parseInt(formData.totalTickets)
      };

      if (isEditing) {
        await axios.put(`/api/events/${id}`, eventData, { withCredentials: true });
      } else {
        await axios.post('/api/events', eventData, { withCredentials: true });
      }

      navigate('/events/manage');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
      console.error('Error saving event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                id="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="theater">Theater</option>
                <option value="conference">Conference</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">
                  Ticket Price ($)
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  id="ticketPrice"
                  required
                  min="0"
                  step="0.01"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700">
                  Total Tickets
                </label>
                <input
                  type="number"
                  name="totalTickets"
                  id="totalTickets"
                  required
                  min="1"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                id="additionalInfo"
                rows={3}
                value={formData.additionalInfo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/events/manage')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;

<EventForm
  initialValues={event}
  onSubmit={handleUpdateEvent}
  isEditing={true}
/>