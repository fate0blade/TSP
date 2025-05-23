import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-indigo-600">Event Ticketing System</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover and book amazing events happening near you. From concerts to conferences, find the perfect event for you.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/events"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Browse Events
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* This section will be populated with actual events later */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="h-40 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="h-40 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="h-40 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 