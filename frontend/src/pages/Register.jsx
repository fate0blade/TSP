import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link as MuiLink,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Business as BusinessIcon,
  PersonOutline as PersonOutlineIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name should be of minimum 2 characters length')
    .required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['user', 'organizer'], 'Please select a valid role')
    .required('Role is required'),
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...userData } = values;
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/register`, userData);
        if (response.data) {
          toast.success('Registration successful!');
          navigate('/login');
        } else {
          console.log(response.error);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'An error occurred during registration';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFFDE7 0%, #ffffff 100%)',
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(45deg, #FFB800 30%, #FFA000 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join us to start exploring amazing events
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ width: '100%' }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl 
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formik.values.role}
                    label="Role"
                    onChange={formik.handleChange}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    startAdornment={
                      <InputAdornment position="start">
                        {formik.values.role === 'organizer' ? (
                          <BusinessIcon color="primary" />
                        ) : (
                          <PersonOutlineIcon color="primary" />
                        )}
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="user">Standard User</MenuItem>
                    <MenuItem value="organizer">Event Organizer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={formik.isSubmitting}
              sx={{
                mt: 3,
                mb: 3,
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
              {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" component="span">
                Already have an account?{' '}
              </Typography>
              <MuiLink 
                component={Link} 
                to="/login" 
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register; 