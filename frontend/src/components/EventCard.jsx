import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  CardActionArea,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  AttachMoney,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const EventCard = ({ event, onDelete, showActions = false }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

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

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Price not set';
    return `$${Number(price).toFixed(2)}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.1)',
          '& .MuiCardMedia-root': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/events/${event._id}`)}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
          {!imageError ? (
            <CardMedia
              component="img"
              height="200"
              image={event.images && event.images.length > 0 ? event.images[0] : 'https://source.unsplash.com/random/800x600/?event'}
              alt={event.title}
              onError={handleImageError}
              sx={{
                transition: 'transform 0.3s ease-in-out',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }}
            >
              <ImageIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
            </Box>
          )}
          <Chip
            label={event.category?.charAt(0).toUpperCase() + event.category?.slice(1) || 'Uncategorized'}
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          />
        </Box>
      </CardActionArea>

      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: 3,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            onClick={() => navigate(`/events/${event._id}`)}
          >
            {event.title}
          </Typography>
          {showActions && (
            <Box>
              <IconButton
                size="small"
                onClick={() => navigate(`/my-events/${event._id}/edit`)}
                sx={{ 
                  mr: 1,
                  backgroundColor: 'rgba(255, 184, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 184, 0, 0.2)',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(event)}
                sx={{
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.2)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {event.description}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5,
          mt: 'auto',
          mb: 2,
          '& .MuiTypography-root': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            fontSize: '0.875rem',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.1rem',
            color: 'primary.main',
          },
        }}>
          <Typography>
            <CalendarToday />
            {formatDate(event.date)}
          </Typography>
          <Typography>
            <LocationOn />
            {event.location}
          </Typography>
          <Typography>
            <AttachMoney />
            {formatPrice(event.ticketPrice)}
          </Typography>
        </Box>

        <Box sx={{ 
          mt: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate(`/events/${event._id}`)}
            sx={{
              flex: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            View Details
          </Button>
          {showActions && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/my-events/${event._id}/analytics`)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Analytics
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard; 