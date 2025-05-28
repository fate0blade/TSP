import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link as MuiLink,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const success = await forgotPassword(values.email);
        if (success) {
          setSuccess(true);
          setError('');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while processing your request');
        setSuccess(false);
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
            Forgot Password
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Enter your email address and we'll send you instructions to reset your password
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

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                width: '100%', 
                mb: 3,
                borderRadius: 2,
              }}
            >
              Password reset instructions have been sent to your email address.
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ width: '100%' }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={success}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={formik.isSubmitting || success}
              sx={{
                py: 1.5,
                mb: 3,
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
              {formik.isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <MuiLink 
                component={Link} 
                to="/login" 
                variant="body2"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
                Back to Sign In
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 