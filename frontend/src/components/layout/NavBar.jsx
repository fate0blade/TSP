import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white font-bold text-xl">
                            Event Ticketing
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <Link to="/events" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                    Events
                                </Link>
                                {user && (user.role === 'Organizer' || user.role === 'Admin') && (
                                    <>
                                        <Link to="/events/create" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                            Create Event
                                        </Link>
                                        <Link to="/events/manage" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                            Manage Events
                                        </Link>
                                    </>
                                )}
                                {user && user.role === 'Admin' && (
                                    <Link to="/admin/dashboard" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                        Admin Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user ? (
                                <Menu as="div" className="ml-3 relative">
                                    <div>
                                        <Menu.Button className="max-w-xs bg-indigo-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={user.profilePicture || 'https://via.placeholder.com/40'}
                                                alt=""
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Your Profile
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <Link to="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Your Bookings
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Sign out
                                                </button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                <div className="flex space-x-4">
                                    <Link to="/login" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                        Login
                                    </Link>
                                    <Link to="/register" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 