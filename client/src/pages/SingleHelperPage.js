import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Button, Alert, Row, Col, Modal, Form } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const SingleHelperPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [helper, setHelper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });

  // Booking Form States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [description, setDescription] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [serviceAddress, setServiceAddress] = useState(userInfo?.address || ''); 
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Example Time Slots (can be dynamically fetched later)
  const timeSlots = [
    '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM'
  ];

  useEffect(() => {
    if (userInfo && userInfo.address && !serviceAddress) {
      setServiceAddress(userInfo.address);
    }

    const fetchHelper = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`http://localhost:5000/api/helpers/${id}`);
        if (!data || data.role !== 'helper') {
            setError('Helper data is invalid or not a service provider.');
            setLoading(false);
            return;
        }
        setHelper(data);
        setLoading(false);
      } catch (err) {
        console.error("SingleHelperPage fetch error:", err.response ? err.response.data : err.message, err);
        if (err.response && err.response.status === 404) {
            setError('Helper not found. The ID might be incorrect or helper removed.');
        } else if (axios.isAxiosError(err) && err.code === 'ERR_NETWORK') {
            setError('Network error. Please ensure backend server is running and accessible.');
        }
        else {
            setError('Failed to load profile. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchHelper();
  }, [id, userInfo?.address]); 

  const handleBookNowClick = () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (userInfo.role !== 'user') {
      setBookingError('Only customers can book services.');
      return;
    }
    setBookingError('');
    setBookingSuccess('');
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setBookingError('');
    setBookingSuccess('');
    setSelectedService('');
    setDescription('');
    setBookingDate('');
    setBookingTime('');
    setServiceAddress(userInfo?.address || '');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!userInfo || userInfo.role !== 'user') {
      setBookingError('You must be logged in as a customer to book a service.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const bookingData = {
        helperId: helper._id,
        service: selectedService,
        description,
        bookingDate,
        bookingTime,
        serviceAddress: serviceAddress || userInfo.address,
        totalCost: helper.hourlyRate,
      };

      const { data } = await axios.post('http://localhost:5000/api/bookings', bookingData, config);
      setBookingSuccess('Booking request sent successfully! Awaiting helper confirmation.');
      setTimeout(() => {
        handleCloseBookingModal();
        navigate('/user-dashboard');
      }, 1500);

    } catch (err) {
      console.error('Booking failed:', err.response ? err.response.data : err.message);
      setBookingError(err.response && err.response.data.message ? err.response.data.message : 'Booking failed. Please try again.');
    }
  };

  const cardBgClass = theme === 'dark' ? 'bg-secondary' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-light' : 'text-dark';
  const mutedTextClass = theme === 'dark' ? 'text-light-50' : 'text-muted';
  const accentColorClass = theme === 'dark' ? 'text-warning' : 'text-primary';
  // Combined button classes for 'Book Now'
  const bookNowButtonClass = `w-100 mt-4 ${theme === 'dark' ? 'btn-success text-white' : 'btn-primary'}`;
  // Class for WhatsApp button
  const whatsappButtonClass = `w-100 mt-2 btn-success`; // WhatsApp is typically green


  const inputClass = theme === 'dark' ? 'bg-dark text-light border-secondary' : '';
  const labelClass = theme === 'dark' ? 'text-light' : 'text-dark';


  if (loading) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">Loading helper profile...</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">
            <strong>Error:</strong> {error}
            <br/>
            Please go back to <Button as={Link} to="/services" variant="link" className="p-0 m-0 align-baseline text-light-50">Helper List</Button> and try another helper.
        </Alert>
      </Container>
    );
  }

  if (!helper) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info">No helper data available. This helper might have been removed.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className={`shadow-lg p-4 ${cardBgClass}`}>
        <Card.Body>
          <Row className="justify-content-center mb-4">
            <Col xs="auto" className="text-center">
              <img src={helper.profilePicture || '/images/default_avatar.png'} alt={helper.name} className="img-fluid rounded-circle mb-3" style={{width: '150px', height: '150px', objectFit: 'cover', border: `4px solid ${theme === 'dark' ? '#ffc107' : '#0d6efd'}`}} />
              <h1 className={`h2 mb-1 ${textClass}`}>
                {helper.name}
                {helper.isProfileComplete && (
                  <span className="badge bg-success ms-2 fs-6">Verified</span>
                )}
                {helper.isIdentityVerified && (
                    <span className="badge bg-primary ms-2 fs-6">
                        <i className="bi bi-patch-check-fill me-1"></i> ID Verified
                    </span>
                )}
              </h1>
              <p className={`lead ${accentColorClass}`}>
                {helper.services.length > 0 ? helper.services.join(' | ') : 'Service Provider'}
              </p>
            </Col>
          </Row>

          <div className="text-center mb-4">
            <span className={`${accentColorClass} fs-4 me-2`}>⭐</span>
            <span className={`${textClass} fw-bold fs-4`}>{helper.averageRating.toFixed(1)}</span>
            <span className={`${mutedTextClass} ms-2`}>({helper.numReviews} Reviews)</span>
          </div>

          <p className={`text-center mb-4 ${mutedTextClass}`}>
            Serving in {helper.city}, {helper.state} {helper.areaOfOperation.length > 0 && `(${helper.areaOfOperation.join(', ')})`}
          </p>

          <hr className={`my-4 ${theme === 'dark' ? 'border-dark' : 'border-light'}`} />

          <h3 className={`mb-3 ${textClass}`}>About {helper.name.split(' ')[0]}</h3>
          <p className={`${mutedTextClass} mb-4`}>
            {helper.bio || 'No detailed biography provided yet.'}
          </p>

          <h3 className={`mb-3 ${textClass}`}>Details</h3>
          <ul className="list-unstyled">
            <li className={`mb-2 ${mutedTextClass}`}>
              <span className={`fw-bold ${accentColorClass}`}>Experience:</span> {helper.experience} Years
            </li>
            <li className={`mb-2 ${mutedTextClass}`}>
              <span className={`fw-bold ${accentColorClass}`}>Hourly Rate:</span> ₹{helper.hourlyRate || 'N/A'}
            </li>
            <li className={`mb-2 ${mutedTextClass}`}>
              <span className={`fw-bold ${accentColorClass}`}>Availability:</span> {helper.availability}
            </li>
            <li className={`mb-2 ${mutedTextClass}`}>
              <span className={`fw-bold ${accentColorClass}`}>Phone:</span> {helper.phone}
            </li>
            <li className={`mb-2 ${mutedTextClass}`}>
              <span className={`fw-bold ${accentColorClass}`}>Email:</span> {helper.email}
            </li>
          </ul>

          <div className="d-grid gap-2"> {/* Use d-grid for full-width stacked buttons */}
            <Button variant={theme === 'dark' ? 'success' : 'primary'} className={bookNowButtonClass} onClick={handleBookNowClick}>
              Book Now
            </Button>
            {/* NEW: Chat on WhatsApp Button */}
            {helper.phone && ( // Only show if helper has a phone number
                <Button 
                    as="a" // Render as an anchor tag
                    href={`https://wa.me/91${helper.phone}`} // WhatsApp URL scheme
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security for target="_blank"
                    variant="success" // WhatsApp green
                    className={whatsappButtonClass}
                >
                    <i className="bi bi-whatsapp me-2"></i> Chat on WhatsApp
                </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={handleCloseBookingModal} centered data-bs-theme={theme}>
        <Modal.Header closeButton className={theme === 'dark' ? 'bg-secondary text-light border-bottom border-dark' : ''}>
          <Modal.Title className={theme === 'dark' ? 'text-light' : ''}>Book Service with {helper.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-secondary text-light' : ''}>
          {bookingError && <Alert variant="danger">{bookingError}</Alert>}
          {bookingSuccess && <Alert variant="success">{bookingSuccess}</Alert>}
          <Form onSubmit={handleBookingSubmit}>
            <Form.Group className="mb-3" controlId="selectedService">
              <Form.Label className={labelClass}>Service Needed</Form.Label>
              <Form.Select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required className={inputClass}>
                <option value="">Select a service</option>
                {helper.services.map((svc) => (
                  <option key={svc} value={svc}>{svc}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label className={labelClass}>Describe Your Task</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., My kitchen sink is leaking badly." required className={inputClass} />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="bookingDate">
                <Form.Label className={labelClass}>Preferred Date</Form.Label>
                <Form.Control type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className={inputClass} min={new Date().toISOString().split('T')[0]} />
              </Form.Group>
              <Form.Group as={Col} controlId="bookingTime">
                <Form.Label className={labelClass}>Preferred Time</Form.Label>
                <Form.Select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} required className={inputClass}>
                  <option value="">Select a time slot</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="serviceAddress">
              <Form.Label className={labelClass}>Service Address</Form.Label>
              <Form.Control type="text" value={serviceAddress} onChange={(e) => setServiceAddress(e.target.value)} placeholder="Enter service address" required className={inputClass} />
              <Form.Text className={mutedTextClass}>Defaults to your registered address.</Form.Text>
            </Form.Group>
            <Button variant={theme === 'dark' ? 'warning' : 'primary'} type="submit" className="w-100">
              Confirm Booking
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SingleHelperPage;