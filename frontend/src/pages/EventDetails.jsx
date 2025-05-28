import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardMedia,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  AttachMoney,
  Person,
  ConfirmationNumber,
  Image as ImageIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const canBookTicket = user?.role === 'user';

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

  const handleBookClick = () => {
    if (!user) {
      setLoginDialogOpen(true);
    } else if (!canBookTicket) {
      toast.error('Only users can book tickets. Organizers cannot book tickets.');
    } else {
      navigate(`/events/${event._id}/book`);
    }
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(false);
    navigate('/login', { state: { from: `/events/${id}` } });
  };

  const handleRegisterClick = () => {
    setLoginDialogOpen(false);
    navigate('/register', { state: { from: `/events/${id}` } });
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

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFFDE7 0%, #ffffff 100%)',
      pb: 6
    }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                overflow: 'hidden',
                borderRadius: 4,
                mb: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              {!imageError ? (
                <CardMedia
                  component="img"
                  height="400"
                  image={event.images && event.images.length > 0 ? event.images[0] : 'https://source.unsplash.com/random/1200x800/?event'}
                  alt={event.title}
                  onError={() => setImageError(true)}
                  sx={{
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <ImageIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
                </Box>
              )}
            </Paper>
          </Grid>

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
                variant="h3" 
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
                {event.title}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  color="primary"
                  sx={{ 
                    mr: 1,
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
                <Chip
                  label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  color={event.status === 'upcoming' ? 'success' : 'default'}
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              </Box>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'text.secondary',
                }}
              >
                {event.description}
              </Typography>
              <Divider sx={{ my: 4 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 184, 0, 0.05)',
                  }}>
                    <AttachMoney color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ticket Price
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        ${event.ticketPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 184, 0, 0.05)',
                  }}>
                    <ConfirmationNumber color="primary" sx={{ fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Available Tickets
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {event.remainingTickets} tickets remaining
                      </Typography>
                    </Box>
                  </Box>
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
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Event Details
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Organized by
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 184, 0, 0.05)',
                }}>
                  <Person color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {event.organizer?.name || 'Unknown Organizer'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                {user?.role === 'organizer' && event.organizer?._id === user._id && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/my-events/${event._id}/edit`)}
                    startIcon={<EditIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Edit Event
                  </Button>
                )}
                {user?.role === 'user' && event.remainingTickets > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/events/${event._id}/book`)}
                    startIcon={<AttachMoney />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0px 4px 12px rgba(255, 184, 0, 0.2)',
                      '&:hover': {
                        boxShadow: '0px 6px 16px rgba(255, 184, 0, 0.3)',
                      },
                    }}
                  >
                    Book Tickets
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Dialog 
          open={loginDialogOpen} 
          onClose={() => setLoginDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Login Required</DialogTitle>
          <DialogContent>
            <Typography>
              Please login with a user account to book tickets for this event. Organizers cannot book tickets.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={() => setLoginDialogOpen(false)}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRegisterClick} 
              color="primary"
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Register
            </Button>
            <Button 
              onClick={handleLoginClick} 
              variant="contained" 
              color="primary"
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Login
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EventDetails; 