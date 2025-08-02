import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap'; // Added Row, Col
import { useTheme } from '../context/ThemeContext';

const UserProfilePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);

      // We are fetching the user's current profile from the backend
      const fetchProfile = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${parsedInfo.token}`,
            },
          };
          // This API endpoint (GET /api/users/profile) needs to exist on backend
          // We implemented it in server/controllers/userController.js and server/routes/userRoutes.js
          const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
          
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            password: '', // Passwords are never pre-filled for security
            confirmPassword: '',
          });
          setLoading(false);
        } catch (err) {
          console.error('Failed to load user profile from API:', err.response ? err.response.data : err.message);
          setError('Failed to load profile. Please try again.');
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setError('Please log in to view your profile.');
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]); // Added navigate to dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // API endpoint to update user profile (PUT /api/users/profile)
      const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
      };

      if (formData.password) {
          updateData.password = formData.password;
      }

      const { data } = await axios.put('http://localhost:5000/api/users/profile', updateData, config);
      setSuccess('Profile updated successfully!');
      
      // Update local storage userInfo (essential for token updates or if any user data changes)
      // The backend returns the updated user object, which should be used to update local storage
      const updatedUserInfo = { ...userInfo, ...data, token: data.token || userInfo.token }; // Keep existing token if not new
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo); // Update state

      // Clear password fields after update for security
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));

      console.log('Updated Profile:', data);

    } catch (err) {
      console.error('Profile update failed:', err.response ? err.response.data : err.message);
      setError(err.response && err.response.data.message ? err.response.data.message : 'Profile update failed. Please try again.');
    }
  };

  const inputClass = theme === 'dark' ? 'bg-dark text-light border-secondary' : '';
  const labelClass = theme === 'dark' ? 'text-light' : 'text-dark';

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">Loading profile...</Alert>
      </Container>
    );
  }

  if (error && !loading && !userInfo?.token) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card className={`shadow-lg p-4 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white'}`} style={{ maxWidth: '800px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Update Your Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={submitHandler}>
            <h4 className="mb-3 mt-4 text-primary">Personal Information</h4>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="name">
                <Form.Label className={labelClass}>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
              </Form.Group>
              <Form.Group as={Col} controlId="email">
                <Form.Label className={labelClass}>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} disabled /> {/* Email often not editable */}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="phone">
                <Form.Label className={labelClass}>Phone Number</Form.Label>
                <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} />
              </Form.Group>
              <Form.Group as={Col} controlId="address">
                <Form.Label className={labelClass}>Address</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} />
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Form.Group as={Col} controlId="city">
                <Form.Label className={labelClass}>City</Form.Label>
                <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} required className={inputClass} />
              </Form.Group>
              <Form.Group as={Col} controlId="state">
                <Form.Label className={labelClass}>State</Form.Label>
                <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} required className={inputClass} />
              </Form.Group>
            </Row>

            <h4 className="mb-3 mt-4 text-primary">Change Password (Optional)</h4>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="password">
                <Form.Label className={labelClass}>New Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="Enter new password" />
              </Form.Group>
              <Form.Group as={Col} controlId="confirmPassword">
                <Form.Label className={labelClass}>Confirm New Password</Form.Label>
                <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="Confirm new password" />
              </Form.Group>
            </Row>

            <Button variant={theme === 'dark' ? 'warning' : 'primary'} type="submit" className="w-100">
              Update Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfilePage;