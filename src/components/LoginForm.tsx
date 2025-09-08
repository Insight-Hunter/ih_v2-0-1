import React, { useState } from 'react';
import { Button, TextField, Alert, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        value={email}
        onChange={e => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        required
        fullWidth
        value={password}
        onChange={e => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" type="submit" fullWidth disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
};
