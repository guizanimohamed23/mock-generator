import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Box, Typography, TextField, Button, Paper, Link as MuiLink, Alert, CircularProgress, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import styled from 'styled-components';

const StyledPaper = styled(motion(Paper))`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 460px;
  width: 100%;
`;
const StyledButton = styled(Button)`
  margin: 1rem 0; height: 48px;
`;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', role: 'Frontend' },
    validationSchema: Yup.object({
      name: Yup.string().min(2).required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
      role: Yup.string().oneOf(['Frontend', 'Backend', 'QA']).required(),
    }),
    onSubmit: async (values) => {
      setLoading(true); setError('');
      try {
        await api.post('/api/auth/register', values);
        navigate('/login');
      } catch (e) {
        setError(e?.response?.data?.message || 'Register failed');
      } finally { setLoading(false); }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <StyledPaper initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} elevation={8}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.3 }}>
            <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          </motion.div>
          <Typography component="h1" variant="h4" gutterBottom>Create account</Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Join Smart MockData Generator and collaborate faster
          </Typography>

          {error && (<Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>)}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <TextField fullWidth id="name" name="name" label="Name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} margin="normal" variant="outlined" disabled={loading} />
            <TextField fullWidth id="email" name="email" label="Email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} margin="normal" variant="outlined" disabled={loading} />
            <TextField fullWidth id="password" name="password" label="Password" type="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} margin="normal" variant="outlined" disabled={loading} />
            <TextField select fullWidth id="role" name="role" label="Role" value={formik.values.role} onChange={formik.handleChange} margin="normal" disabled={loading}>
              <MenuItem value="Frontend">Frontend</MenuItem>
              <MenuItem value="Backend">Backend</MenuItem>
              <MenuItem value="QA">QA</MenuItem>
            </TextField>
            <StyledButton type="submit" fullWidth variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : null}>
              {loading ? 'Creating...' : 'Register'}
            </StyledButton>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" variant="body2">Sign in</MuiLink>
            </Typography>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
}


