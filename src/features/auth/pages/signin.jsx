import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { signIn } from '../auth.api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await signIn({ email, password });

      if (response?.accessToken) {
        const decoded = jwtDecode(response.accessToken);

        // Check if the role is 'user'
        if (decoded.role === 'user') {
          setError("You are not authorized to log in to the admin panel.");
          return;
        }

        // Save the token and redirect
        localStorage.setItem('accessToken', response.accessToken);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Sign in failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to MaxiCoffee
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Sign in to your account
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSignIn}
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 400,
          gap: 2,
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" fullWidth>
          Sign In
        </Button>
      </Paper>
    </Box>
  );
};

export default SignIn;
