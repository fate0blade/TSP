import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import EventDetailsPage from './pages/EventDetailsPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import MyEventsPage from './pages/MyEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventAnalyticsPage from './pages/EventAnalyticsPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Routes - All Authenticated Users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Standard User Routes */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <BookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/:id"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <BookingDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Event Organizer Routes */}
              <Route
                path="/my-events"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <MyEventsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/new"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <EditEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-events/analytics"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <EventAnalyticsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEventsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;