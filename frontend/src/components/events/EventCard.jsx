import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  return (
    <Link
      to={`/events/${event._id}`}
      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={event.imageUrl || '/default-event.jpg'}
          alt={event.title}
          className="object-cover w-full h-48"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-500 text-sm mb-4">{event.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {format(new Date(event.date), 'MMM dd, yyyy')}
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-indigo-600 font-semibold">${event.ticketPrice}</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            event.ticketsAvailable > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {event.ticketsAvailable > 0 ? `${event.ticketsAvailable} tickets left` : 'Sold out'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;