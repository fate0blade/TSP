import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  getCurrentUser: () => api.get('/auth/me'),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  updateUserRole: (id, role) => api.put(`/users/${id}`, { role }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Event API calls
const API_URL = 'http://localhost:5000/api';

export const eventAPI = {
  getAllEvents: () => axios.get(`${API_URL}/events`),
  getEventById: (id) => axios.get(`${API_URL}/events/${id}`),
  createEvent: (eventData) => axios.post(`${API_URL}/events`, eventData),
  updateEvent: (id, eventData) => axios.put(`${API_URL}/events/${id}`, eventData),
  deleteEvent: (id) => axios.delete(`${API_URL}/events/${id}`)
};

// Booking API calls
export const bookingAPI = {
  createBooking: (eventId, bookingData) => 
    axios.post(`${API_URL}/bookings/${eventId}`, bookingData),
  getUserBookings: () => axios.get(`${API_URL}/bookings`),
  cancelBooking: (bookingId) => 
    axios.delete(`${API_URL}/bookings/${bookingId}`)
};

export default api;