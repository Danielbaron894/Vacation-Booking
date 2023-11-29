import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [registrationError, setRegistrationError] = useState(null);
  const [emailExistsError, setEmailExistsError] = useState(null); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First Name is required';
      valid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last Name is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters long';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch('https://servervacations-m9l9.onrender.com/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          navigate('/login');
        } else {
          const data = await response.json();
          if (data.error === 'Email already registered') {
            setEmailExistsError('This email is already in use. Please choose another email.');
          } else {
            setRegistrationError(data.error || 'Error registering the user');
          }
        }
      } catch (error) {
        console.error('Error registering the user:', error);
        setRegistrationError('Error registering the user');
      }
    }
  };



  return (
    <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', width: '100%' }}>
        <Typography variant="h5" gutterBottom fontFamily="Poppins">
          Register a new membership
        </Typography>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          margin="normal"
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          margin="normal"
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          
          label="Confirm Password"
          variant="outlined"
          fullWidth
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        {emailExistsError && (
          <Typography variant="body2" color="error">
            {emailExistsError}
          </Typography>
        )}

        {registrationError && (
          <Typography variant="body2" color="error">
            {registrationError}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" style={{ fontFamily: 'Poppins' }}>
          Register
        </Button>
        <Typography variant="body2" gutterBottom color={"white"} fontFamily="Poppins">
          Already have an account? <Link to="/login">Sign In</Link>
        </Typography>
      </form>
    </Box>
  );
}

export default Register;
