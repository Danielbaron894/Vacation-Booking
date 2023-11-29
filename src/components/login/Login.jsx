import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('https://servervacations-m9l9.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.jwt);

            if (data.status === 200) {
                navigate('/home');
            } else {
                setLoginError('User does not have the required permissions to access the home page');
            }
        } else {
            const errorData = await response.json();
            setLoginError(errorData.error || 'Error logging in');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        setLoginError('Error logging in');
    }
};
  

  return (
    <Box display="flex" justifyContent="center"  alignItems="center" height="100vh">
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom fontFamily= 'Poppins'>
          Sign in to find the perfect vacation
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
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
        />
        {loginError && (
          <Typography color="error" variant="body1" gutterBottom>
            {loginError}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" style={{ fontFamily: 'Poppins' }}>
          Sign In
        </Button>
        <Typography variant="body2" gutterBottom color={"white"} fontFamily="Poppins">
          Don't have an account?
          <Link to="/" underline='always'>{" "}
            Register
          </Link>{" "}
          to create a new membership.
        </Typography>
      </form>
    </Box>
  );
}

export default Login;
