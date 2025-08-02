import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { Container, Card, Button, Alert, Tab, Tabs, Row, Col, Dropdown } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const HelperDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [assignedBookings, setAssignedBookings] = useState([]); // Renamed from 'bookings' for clarity
  const [helperProfile, setHelperProfile] = useState(null); // State for helper's own profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);

      if (parsedInfo.role !== 'helper') {
        setError('You are not authorized to view this page.');
        setLoading(false);
        navigate('/'); // Redirect non-helpers
        return;
      }

      const fetchData = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${parsedInfo.token}` },
          };

          // --- Fetch Helper's Own Profile ---
          const { data: profileData } = await axios.get('http://localhost:5000/api/helpers/profile', config);
          setHelperProfile(profileData);

          // --- Fetch Assigned Bookings ---
          const { data: bookingsData } = await axios.get('http://localhost:5000/api/bookings/assigned-to-me', config);
          setAssignedBookings(bookingsData);

          setLoading(false);
        } catch (err) {
          setError('Failed to load dashboard data. Please try again.');
          console.error('HelperDashboard fetch error:', err.response ? err.response.data : err.message);
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setError('Please log in to view your dashboard.');
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to "${newStatus}"?`)) {
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: newStatus }, config);
      setAssignedBookings(assignedBookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
      alert(`Booking status updated to "${newStatus}"!`);
    } catch (err) {
      setError(`Failed to update booking status to "${newStatus}".`);
      console.error(err);
    }
  };

  const filterBookings = (statusType) => {
    const now = new Date();
    return assignedBookings.filter(booking => {
      const [time, ampm] = booking.bookingTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const bookingDateObj = new Date(booking.bookingDate);
      bookingDateObj.setHours(hours, minutes, 0, 0);

      if (statusType === 'upcoming') {
        return (bookingDateObj > now && ['pending', 'confirmed'].includes(booking.status));
      }
      if (statusType === 'past') {
        return (bookingDateObj <= now || ['completed', 'cancelled', 'rejected'].includes(booking.status));
      }
      return true;
    });
  };

  const renderBookingCard = (booking) => (
    <Col md={6} lg={4} key={booking._id} className="mb-4">
      <Card className={`h-100 shadow-sm ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-bold fs-5 text-primary">{booking.service}</Card.Title>
          <Card.Subtitle className={`mb-2 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            <i className="bi bi-person-fill me-1"></i> Customer: {booking.user.name}
          </Card.Subtitle>
          <Card.Text className={`mb-1 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            <i className="bi bi-phone-fill me-1"></i> Phone: {booking.user.phone}
          </Card.Text>
          <Card.Text className={`mb-1 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            <i className="bi bi-envelope-fill me-1"></i> Email: {booking.user.email}
          </Card.Text>
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

          {/* Action buttons/dropdown for helper */}
          <div className="mt-auto d-flex flex-column gap-2">
            {['pending', 'confirmed'].includes(booking.status) && (
              <Dropdown className="w-100">
                <Dropdown.Toggle variant={theme === 'dark' ? 'info' : 'secondary'} className="w-100">
                  Update Status
                </Dropdown.Toggle>
                <Dropdown.Menu data-bs-theme={theme}>
                  {booking.status === 'pending' && (
                    <Dropdown.Item onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}>Confirm</Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}>Mark Completed</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}>Cancel</Dropdown.Item>
                  
                </Dropdown.Menu>
              </Dropdown>
            )}
            {booking.status === 'completed' && (
                <Button variant="success" disabled className="w-100">
                    Completed
                </Button>
            )}
            {['cancelled', 'rejected'].includes(booking.status) && (
                 <Button variant="outline-danger" disabled className="w-100">
                    {booking.status}
                </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

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
      <h1 className={`text-center mb-5 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Helper Dashboard</h1>

      {/* Helper's Own Profile Card */}
      {helperProfile && (
        <Card className={`mb-5 shadow-lg ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
          <Card.Body className="d-flex flex-column flex-md-row align-items-center">
            <div className="me-md-4 mb-4 mb-md-0 text-center">
              <img src={helperProfile.profilePicture || '/images/default_avatar.png'} alt={helperProfile.name} className="img-fluid rounded-circle" style={{ width: '150px', height: '150px', objectFit: 'cover', border: `4px solid ${theme === 'dark' ? '#ffc107' : '#0d6efd'}` }} />
              <h3 className="mt-3 fs-4 fw-bold">{helperProfile.name}</h3>
              <p className="text-muted">{helperProfile.services.length > 0 ? helperProfile.services.join(', ') : 'Service Provider'}</p>
            </div>
            <div className="flex-grow-1 text-md-start text-center">
              <p className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i> {helperProfile.city}, {helperProfile.state}</p>
              <p className="mb-2"><i className="bi bi-briefcase-fill me-2"></i> Experience: {helperProfile.experience} Years</p>
              <p className="mb-2"><i className="bi bi-star-fill me-2 text-warning"></i> Rating: {helperProfile.averageRating.toFixed(1)} ({helperProfile.numReviews} Reviews)</p>
              <p className="mb-2"><i className="bi bi-currency-rupee me-2"></i> Hourly Rate: ₹{helperProfile.hourlyRate}</p>
              <p className="mb-0"><i className="bi bi-person-lines-fill me-2"></i> Bio: {helperProfile.bio || 'No bio provided.'}</p>
            </div>
            <div className="ms-md-auto mt-4 mt-md-0 d-flex flex-column gap-2">
              <Button as={Link} to="/helper-profile" variant={theme === 'dark' ? 'warning' : 'primary'}>
                Edit Profile
              </Button>
              {/* <Button variant="outline-danger">Delete Profile (Soon!)</Button> */}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Assigned Bookings Tabs */}
      <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>My Tasks</h2>
      <Tabs defaultActiveKey="upcoming" id="helper-bookings-tab" className={`mb-3 ${theme === 'dark' ? 'nav-tabs-dark' : ''}`}>
        <Tab eventKey="upcoming" title="Upcoming Tasks">
          {filterBookings('upcoming').length === 0 ? (
            <Alert variant="info" className="text-center">No upcoming tasks.</Alert>
          ) : (
            <Row>
              {filterBookings('upcoming').map(renderBookingCard)}
            </Row>
          )}
        </Tab>
        <Tab eventKey="past" title="Past Tasks">
          {filterBookings('past').length === 0 ? (
            <Alert variant="info" className="text-center">No past tasks.</Alert>
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

export default HelperDashboard;