import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const LoginPage = ({ setUserInfo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      setSuccess('Login successful! Redirecting...');

      navigate('/'); // <--- Redirect to Homepage for all roles

    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card className={`shadow-lg p-4 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white'}`} style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login to Your Account</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
              />
            </Form.Group>

            <Button variant={theme === 'dark' ? 'warning' : 'primary'} type="submit" className="w-100 mb-3">
              Login
            </Button>
          </Form>
          <p className={`text-center mt-3 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            Don't have an account? <Link to="/register" className={theme === 'dark' ? 'text-warning' : 'text-primary'}>Register Here</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;