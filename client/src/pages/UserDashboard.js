import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Tab, Tabs, Row, Col, Form } from 'react-bootstrap'; // Import Form
import { useTheme } from '../context/ThemeContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  // Search states for "Find Helper" section
  const [searchService, setSearchService] = useState('');
  const [searchCity, setSearchCity] = useState('Pali'); // Default to Pali
  const serviceCategories = ['Electrician', 'Plumber', 'Carpenter', 'Home Cleaning', 'Appliance Repair', 'Painter', 'AC Service', 'Pest Control', 'Other'];

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);

      if (parsedInfo.role !== 'user') {
        setError('You are not authorized to view this page.');
        setLoading(false);
        navigate('/'); // Redirect non-users
        return;
      }

      const fetchMyBookings = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${parsedInfo.token}` },
          };
          const { data } = await axios.get('http://localhost:5000/api/bookings/my-bookings', config);
          setBookings(data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch bookings. Please try again.');
          setLoading(false);
        }
      };
      fetchMyBookings();
    } else {
      setError('Please log in to view your dashboard.');
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: 'cancelled' }, config);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      alert('Booking cancelled successfully!');
    } catch (err) {
      setError('Failed to cancel booking.');
      console.error(err);
    }
  };

  const filterBookings = (status) => {
    return bookings.filter(booking => {
        if (status === 'upcoming') {
            return ['pending', 'confirmed'].includes(booking.status);
        }
        if (status === 'past') {
            return ['completed', 'cancelled', 'rejected'].includes(booking.status);
        }
        return true; // Should not happen with specific tabs
    });
  };

  const renderBookingCard = (booking) => (
    <Col md={6} lg={4} key={booking._id} className="mb-4">
      <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-bold fs-5 text-primary">{booking.service}</Card.Title>
          <Card.Subtitle className={`mb-2 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            <i className="bi bi-person-fill me-1"></i> Helper: {booking.helper.name}
          </Card.Subtitle>
          <Card.Text className={`mb-1 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            <i className="bi bi-calendar me-1"></i> Date: {new Date(booking.bookingDate).toLocaleDateString()}
          </Card.Text>
          <Card.Text className={`mb-1 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            <i className="bi bi-clock me-1"></i> Time: {booking.bookingTime}
          </Card.Text>
          <Card.Text className={`mb-1 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            <i className="bi bi-geo-alt-fill me-1"></i> Address: {booking.serviceAddress}
          </Card.Text>
          <Card.Text className={`mb-3 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            <i className="bi bi-info-circle-fill me-1"></i> Status: <span className={`fw-bold text-uppercase
                ${booking.status === 'pending' ? 'text-warning' : ''}
                ${booking.status === 'confirmed' ? 'text-success' : ''}
                ${booking.status === 'completed' ? 'text-primary' : ''}
                ${['cancelled', 'rejected'].includes(booking.status) ? 'text-danger' : ''}`}>{booking.status}</span>
          </Card.Text>
          <Card.Text className={`mb-3 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            Description: {booking.description}
          </Card.Text>

          {/* Action buttons based on status */}
          <div className="mt-auto d-flex gap-2">
            {booking.status === 'pending' && (
              <Button variant="danger" size="sm" onClick={() => handleCancelBooking(booking._id)} className="w-100">
                Cancel Booking
              </Button>
            )}
            {booking.status === 'confirmed' && (
              <Button variant="danger" size="sm" onClick={() => handleCancelBooking(booking._id)} className="w-100">
                Cancel Booking
              </Button>
            )}
            {booking.status === 'completed' && !booking.isReviewed && (
              <Button variant="info" size="sm" className="w-100">
                Rate Helper (Soon!)
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  // Handle search submission on User Dashboard
  const handleFindHelperSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchService) params.append('service', searchService);
    if (searchCity) params.append('city', searchCity);
    navigate(`/services?${params.toString()}`); // Redirect to HelperListPage with filters
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">Loading dashboard...</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className={`text-center mb-5 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>My Dashboard</h1>

      {/* Find Helper Search Section */}
      <Card className={`mb-5 p-4 shadow-lg ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
        <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Find a Helper for Your Next Task</h2>
        <Form onSubmit={handleFindHelperSubmit}>
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Group controlId="searchService">
                <Form.Label className={theme === 'dark' ? 'text-light' : 'text-dark'}>Service Category</Form.Label>
                <Form.Select value={searchService} onChange={(e) => setSearchService(e.target.value)} className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}>
                  <option value="">Select Service...</option>
                  {serviceCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group controlId="searchCity">
                <Form.Label className={theme === 'dark' ? 'text-light' : 'text-dark'}>City</Form.Label>
                <Form.Control type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} placeholder="e.g., Pali" required className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant={theme === 'dark' ? 'warning' : 'primary'} type="submit" className="w-100">
                <i className="bi bi-search me-1"></i> Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* My Bookings Tabs Section */}
      <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>My Bookings</h2>
      <Tabs defaultActiveKey="upcoming" id="user-bookings-tab" className={`mb-3 ${theme === 'dark' ? 'nav-tabs-dark' : ''}`}>
        <Tab eventKey="upcoming" title="Upcoming Bookings">
          {filterBookings('upcoming').length === 0 ? (
            <Alert variant="info" className="text-center">No upcoming bookings.</Alert>
          ) : (
            <Row>
              {filterBookings('upcoming').map(renderBookingCard)}
            </Row>
          )}
        </Tab>
        <Tab eventKey="past" title="Past Bookings">
          {filterBookings('past').length === 0 ? (
            <Alert variant="info" className="text-center">No past bookings.</Alert>
          ) : (
            <Row>
              {filterBookings('past').map(renderBookingCard)}
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;