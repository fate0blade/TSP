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
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/users`,
          { withCredentials: true }
        );
        setUsers(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      setUpdating(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/users/${selectedUser._id}`,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === "User deleted successfully") {
        setUsers(users.filter(u => u._id !== selectedUser._id));
        setDeleteDialogOpen(false);
        setSelectedUser(null);
        setError('');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      if (err.response?.status === 401) {
        setError('You are not authorized to delete users. Please log in as an admin.');
      } else if (err.response?.status === 404) {
        setError('User not found. It may have been already deleted.');
      } else {
        setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      setUpdating(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/${user._id}/status`,
        { isActive: !user.isActive },
        { withCredentials: true }
      );
      setUsers(users.map(u => u._id === user._id ? response.data : u));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
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
          User Management
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
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          color={user.role === 'admin' ? 'error' : user.role === 'organizer' ? 'primary' : 'default'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{formatDate(user.updatedAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(user)}
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
            count={users.length}
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
          <DialogTitle sx={{ fontWeight: 600 }}>Delete User</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>? This action cannot be undone.
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
                'Delete User'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminUsers; 