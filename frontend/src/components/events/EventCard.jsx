import { Link } from 'react-router-dom';

const EventCard = ({ event }) => (
  <Link
    to={`/events/${event._id}`}
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <img
      src={event.imageUrl || '/default-event.jpg'}
      alt={event.title}
      className="h-40 w-full object-cover rounded mb-3"
    />
    <h2 className="text-lg font-semibold mb-1">{event.title}</h2>
    <div className="text-gray-600 text-sm mb-1">
      <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
    </div>
    <div className="text-gray-600 text-sm mb-1">
      <span className="font-medium">Location:</span> {event.location}
    </div>
    <div className="text-indigo-600 font-bold mt-auto">
      ${event.ticketPrice}
    </div>
  </Link>
);

export default EventCard;

import EventCard from './EventCard';

{events.map(event => (
  <EventCard event={event} key={event._id} />
))}