import React, { useState } from 'react'; // Import useState for local state if needed
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap'; // Import Card
import { useNavigate, Link } from 'react-router-dom'; // Add Link here// Import useNavigate for search redirection
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';


const HomePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [searchService, setSearchService] = useState('');
  const [searchCity, setSearchCity] = useState(''); // Default to Pali

  const serviceCategories = [
      { name: 'Electrician', icon: 'lightning-fill' },
      { name: 'Plumber', icon: 'tools' },
      { name: 'Carpenter', icon: 'hammer' },
      { name: 'Home Cleaning', icon: 'house-fill' },
      { name: 'Appliance Repair', icon: 'gear-fill' },
      { name: 'Painter', icon: 'palette-fill' },
      { name: 'AC Service', icon: 'snow' },
      { name: 'Pest Control', icon: 'bug-fill' },
      { name: 'Other', icon: 'question-circle-fill' },
  ];

  const handleMainSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchService) params.append('service', searchService);
    if (searchCity) params.append('city', searchCity);
    navigate(`/services?${params.toString()}`); // Redirect to HelperListPage with filters
  };

  const handleCategoryClick = (categoryName) => {
    const params = new URLSearchParams();
    params.append('service', categoryName);
    params.append('city', searchCity); // Keep the default city or current search city
    navigate(`/services?${params.toString()}`);
  };

  return (
    <div className={`text-center py-5`}>
    <h1 className="display-4 fw-bold mb-4 text-center text-dark">
  Your Local Trusted Verified Service Provider,<br />
  <span className="text-primary">Just a Click Away.</span>
</h1>


      <p className="lead mb-5">
        Connecting you with trusted electricians, plumbers, carpenters & more Helpfull.
      </p>
      
      {/* Main Search Bar */}
      <Container className={`p-4 rounded-3 shadow-lg ${theme === 'dark' ? 'bg-secondary' : 'bg-white'}`} style={{ maxWidth: '800px' }}>
        <Form onSubmit={handleMainSearchSubmit} className="d-flex flex-column flex-md-row justify-content-center align-items-center">
          <Form.Control
            type="text"
            placeholder="I need a... (e.g., Electrician, Plumber)"
            className={`flex-grow-1 me-md-2 mb-3 mb-md-0 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
            value={searchService}
            onChange={(e) => setSearchService(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="In Your City"
            className={`w-md-auto me-md-2 mb-3 mb-md-0 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
            style={{ minWidth: '200px' }}
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <Button variant="success" type="submit" className="w-100 w-md-auto">
            Find Helper
          </Button>
        </Form>
        <div className="d-flex justify-content-center mt-3 gap-2">
            <Button variant="danger" className="w-100 w-md-auto">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>Emergency Service
            </Button>
            <Button variant="info" className="w-100 w-md-auto">
                <i className="bi bi-mic-fill me-2"></i>Voice Search
            </Button>
        </div>
      </Container>

      {/* "How It Works" Section */}
      <Container className="py-5">
        <h2 className="mb-4">How It Works</h2>
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <i className={`bi bi-search display-4 mb-3 ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}></i>
            <h3 className="h5">Search & Discover</h3>
            <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>Easily find qualified and verified helpers near you.</p>
          </Col>
          <Col md={4} className="mb-4">
            <i className={`bi bi-calendar-check display-4 mb-3 ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}></i>
            <h3 className="h5">Book Your Service</h3>
            <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>Schedule a convenient time directly on the platform.</p>
          </Col>
          <Col md={4} className="mb-4">
            <i className={`bi bi-tools display-4 mb-3 ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}></i>
            <h3 className="h5">Get It Done!</h3>
            <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>Experienced professionals complete your task efficiently.</p>
          </Col>
        </Row>
      </Container>

      {/* Popular Services Section (NEW) */}
      <Container className={`py-5 ${theme === 'dark' ? 'bg-dark-subtle' : 'bg-light'}`}>
        <h2 className={`mb-5 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Popular Services</h2>
        <Row xs={2} md={4} lg={5} className="g-4 justify-content-center">
          {serviceCategories.map((category) => (
            <Col key={category.name}>
              <Card 
                className={`h-100 text-center py-4 px-2 shadow-sm cursor-pointer ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}
                onClick={() => handleCategoryClick(category.name)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <i className={`bi bi-${category.icon} display-4 mb-3 ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}></i>
                  <Card.Title className="h5">{category.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Placeholder for Testimonials / CTA for Helpers */}
      <Container className="py-5">
        <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>What Our Customers Say</h2>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className={`p-4 shadow-sm ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
              <Card.Body className="text-center">
                <blockquote className="blockquote mb-0">
                  <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>"My Personal Helper made finding a plumber so easy! Quick, reliable, and professional service. Highly recommend!"</p>
                  <footer className={`blockquote-footer ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
                    Priya Sharma, <cite title="Source Title">Pali</cite>
                  </footer>
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="text-center mt-5">
          <h2 className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Are You a Skilled Helper?</h2>
          <p className={`lead ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>Join our network and connect with thousands of local customers.</p>
          <Button as={Link} to="/register" variant="success" size="lg">Join as a Helper</Button>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;