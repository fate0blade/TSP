import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const AdminEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/events`,
          { withCredentials: true }
        );
        setEvents(response.data);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    try {
      setUpdating(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/events/${selectedEvent._id}`,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === "Event deleted successfully") {
        setEvents(events.filter(e => e._id !== selectedEvent._id));
        setDeleteDialogOpen(false);
        setSelectedEvent(null);
        setError('');
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      if (err.response?.status === 401) {
        setError('You are not authorized to delete events. Please log in as an admin.');
      } else if (err.response?.status === 404) {
        setError('Event not found. It may have been already deleted.');
      } else {
        setError(err.response?.data?.message || 'Failed to delete event. Please try again.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusUpdate = async (event, newStatus) => {
    try {
      setUpdating(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/events/${event._id}`,
        { status: newStatus },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.event) {
        setEvents(events.map(e => e._id === event._id ? response.data.event : e));
        setError('');
      } else {
        throw new Error('Failed to update event status');
      }
    } catch (err) {
      console.error('Error updating event status:', err);
      if (err.response?.status === 401) {
        setError('You are not authorized to update event status. Please log in as an admin.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to update event status.');
      } else if (err.response?.status === 404) {
        setError('Event not found.');
      } else {
        setError(err.response?.data?.message || 'Failed to update event status. Please try again.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
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
          Event Management
        </Typography>

        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Organizer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.organizer?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Chip
                          label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          color={
                            event.status === 'upcoming' ? 'success' :
                            event.status === 'pending' ? 'warning' :
                            event.status === 'completed' ? 'info' :
                            'error'
                          }
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {event.status === 'pending' && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleStatusUpdate(event, 'upcoming')}
                              disabled={updating}
                              sx={{ mr: 1 }}
                              title="Accept Event"
                            >
                              <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleStatusUpdate(event, 'cancelled')}
                              disabled={updating}
                              sx={{ mr: 1 }}
                              title="Reject Event"
                            >
                              <CancelIcon />
                            </IconButton>
                          </>
                        )}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(event)}
                          disabled={updating}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={events.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Delete Event</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the event <strong>{selectedEvent?.title}</strong>? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={updating}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={updating}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              {updating ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Deleting...
                </>
              ) : (
                'Delete Event'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminEvents; 