import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/check-auth', { 
        withCredentials: true 
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', 
        { email, password },
        { withCredentials: true }
      );
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', { ...userData, password: '[HIDDEN]' });
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/register', 
        userData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Registration response:', response.data);
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, 
        { withCredentials: true }
      );
      // Clear token from localStorage and axios headers
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Logout failed' 
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', 
        { email },
        { withCredentials: true }
      );
      return { success: true };
    } catch (error) {
      console.error('Password reset request failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to send reset email' 
      };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 