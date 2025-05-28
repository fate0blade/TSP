import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  CardMedia,
  Chip,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  AttachMoney,
  ConfirmationNumber,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const UserBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/users/bookings`,
          { withCredentials: true }
        );
        setBookings(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFFDE7 0%, #ffffff 100%)',
      pb: 6
    }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            background: 'linear-gradient(45deg, #FFB800 30%, #FFA000 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Bookings
        </Typography>

        {bookings.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              textAlign: 'center',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Bookings Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You haven't booked any events yet. Start exploring events to make your first booking!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
              }}
            >
              Browse Events
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} key={booking._id}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ 
                        height: 200,
                        borderRadius: 2,
                        overflow: 'hidden',
                        position: 'relative',
                      }}>
                        {booking.event.images && booking.event.images.length > 0 ? (
                          <CardMedia
                            component="img"
                            image={booking.event.images[0]}
                            alt={booking.event.title}
                            sx={{
                              height: '100%',
                              width: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            }}
                          >
                            <ImageIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                          variant="h5" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                          onClick={() => navigate(`/events/${booking.event._id}`)}
                        >
                          {booking.event.title}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={booking.event.category.charAt(0).toUpperCase() + booking.event.category.slice(1)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1, fontWeight: 600 }}
                          />
                          <Chip
                            label={booking.event.status.charAt(0).toUpperCase() + booking.event.status.slice(1)}
                            color={booking.event.status === 'upcoming' ? 'success' : 'default'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              color: 'text.secondary',
                            }}>
                              <CalendarToday fontSize="small" />
                              <Typography variant="body2">
                                {formatDate(booking.event.date)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              color: 'text.secondary',
                            }}>
                              <LocationOn fontSize="small" />
                              <Typography variant="body2">
                                {booking.event.location}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 'auto',
                        }}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Booking Details
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                              }}>
                                <ConfirmationNumber fontSize="small" color="primary" />
                                <Typography variant="body2">
                                  {booking.quantity} {booking.quantity === 1 ? 'Ticket' : 'Tickets'}
                                </Typography>
                              </Box>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                              }}>
                                <AttachMoney fontSize="small" color="primary" />
                                <Typography variant="body2">
                                  ${booking.totalPrice.toFixed(2)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate(`/events/${booking.event._id}`)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            View Event
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default UserBookings; 