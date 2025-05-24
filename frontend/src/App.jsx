import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/layout/NavBar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import EventList from './components/events/EventList';
import EventDetail from './components/events/EventDetail';
import EventForm from './components/events/EventForm';
import EventManagement from './components/events/EventManagement';
import UserProfile from './components/profile/UserProfile';
import ProtectedRoute from './components/routes/ProtectedRoute';
import UserBookingsPage from './components/bookings/UserBookingsPage';
import BookingDetails from './components/bookings/BookingDetails';
import AdminUsersPage from './components/admin/AdminUsersPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <NavBar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />

              {/* Protected Routes - Any authenticated user */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />

              {/* Protected Routes - Organizers Only */}
              <Route path="/events/create" element={
                <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                  <EventForm />
                </ProtectedRoute>
              } />
              <Route path="/events/manage" element={
                <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                  <EventManagement />
                </ProtectedRoute>
              } />
              <Route path="/events/edit/:id" element={
                <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
                  <EventForm />
                </ProtectedRoute>
              } />

              {/* Protected Routes - Standard User */}
              <Route path="/bookings" element={
                <ProtectedRoute>
                  <UserBookingsPage />
                </ProtectedRoute>
              } />
              <Route path="/bookings/:id" element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/events" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <EventManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              } />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
  