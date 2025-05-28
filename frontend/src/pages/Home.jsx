import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import EventCard from '../components/EventCard';

const categories = ['All', 'Music', 'Sports', 'Theater', 'Business', 'Comedy', 'Education', 'Technology', 'Other'];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(!isMobile);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/events`);
        if (response.data && Array.isArray(response.data)) {
          // Ensure all events have a valid image
          const processedEvents = response.data.map(event => ({
            ...event,
            imageUrl: event.images && event.images.length > 0 
              ? event.images[0] 
              : 'https://source.unsplash.com/random/800x600/?event'
          }));
          setEvents(processedEvents);
        }
        setError('');
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFFDE7 0%, #ffffff 100%)',
      pb: 6
    }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 4 }}>
        <Box sx={{ 
          mb: 6,
          textAlign: 'center'
        }}>
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
              mb: 2
            }}
          >
            Discover Amazing Events
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}
          >
            Find and book tickets for the best events in your area
          </Typography>
          
          <Box sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            position: 'relative',
            mb: 4
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search events by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: {
                      backgroundColor: 'white',
                      borderRadius: 3,
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.08)',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    IconComponent={ArrowDownIcon}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 3,
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.08)',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {filteredEvents.length === 0 ? (
            <Grid item xs={12}>
              <Alert 
                severity="info"
                sx={{ 
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                No events found matching your search criteria.
              </Alert>
            </Grid>
          ) : (
            filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <EventCard event={event} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 