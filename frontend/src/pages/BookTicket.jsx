import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  CardMedia,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CalendarToday,
  LocationOn,
  AttachMoney,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const BookTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/events/${id}`);
        setEvent(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch event details. Please try again later.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

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

  const handleTicketCountChange = (increment) => {
    const newCount = ticketCount + increment;
    if (newCount >= 1 && newCount <= event.remainingTickets) {
      setTicketCount(newCount);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings`,
        {
          event: event._id,
          quantity: ticketCount,
        },
        { withCredentials: true }
      );

      toast.success('Tickets booked successfully!');
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book tickets. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to book tickets');
    } finally {
      setSubmitting(false);
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

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Event not found</Alert>
      </Container>
    );
  }

  const totalPrice = event.ticketPrice * ticketCount;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFFDE7 0%, #ffffff 100%)',
      pb: 6
    }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                mb: 3,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #FFB800 30%, #FFA000 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Book Tickets
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 184, 0, 0.05)',
                  }}>
                    <CalendarToday color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatDate(event.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 184, 0, 0.05)',
                  }}>
                    <LocationOn color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 184, 0, 0.05)',
                  }}>
                    <Person color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Organizer
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {event.organizer?.name || 'Unknown Organizer'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Select Number of Tickets
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={ticketCount}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 1 && value <= event.remainingTickets) {
                        setTicketCount(value);
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() => handleTicketCountChange(-1)}
                            disabled={ticketCount <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTicketCountChange(1)}
                            disabled={ticketCount >= event.remainingTickets}
                          >
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mt: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {event.remainingTickets} tickets remaining
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                position: 'sticky',
                top: 20,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Ticket Price</Typography>
                  <Typography>${event.ticketPrice.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Quantity</Typography>
                  <Typography>{ticketCount}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleSubmit}
                disabled={submitting || event.remainingTickets === 0}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0px 4px 12px rgba(255, 184, 0, 0.2)',
                  '&:hover': {
                    boxShadow: '0px 6px 16px rgba(255, 184, 0, 0.3)',
                  },
                }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookTicket; 