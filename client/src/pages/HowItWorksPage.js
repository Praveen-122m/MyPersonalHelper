import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const HowItWorksPage = () => {
  const { theme } = useTheme();

  return (
    <Container className="py-5">
      <h1 className={`text-center mb-5 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>How It Works</h1>

      <Row className="justify-content-center mb-5">
        <Col md={8} className="text-center">
          <p className={`lead ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            Connecting local customers with skilled service providers is simple with My Personal Helper. Here's a quick guide on how to get started, whether you need help or want to offer your services.
          </p>
        </Col>
      </Row>

      {/* For Customers */}
      <Card className={`mb-5 shadow-lg ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
        <Card.Body className="p-4 p-md-5">
          <h2 className={`text-center mb-4 ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}>For Customers: Get the Help You Need</h2>
          <Row className="align-items-center g-4">
            <Col md={4} className="text-center">
              <i className={`bi bi-search display-3 mb-3 ${theme === 'dark' ? 'text-light' : 'text-primary'}`}></i>
              <h3 className="h5">1. Search & Discover</h3>
              <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                Easily find local electricians, plumbers, carpenters, and more. Use our search bar on the homepage or filters on the services page to narrow down your options by category, location, and rating.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <i className={`bi bi-calendar-check display-3 mb-3 ${theme === 'dark' ? 'text-light' : 'text-primary'}`}></i>
              <h3 className="h5">2. View Profile & Book</h3>
              <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                Browse detailed helper profiles, see their services, experience, and reviews. When you find the right helper, simply click "Book Now" to schedule a service at your preferred date, time, and location.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <i className={`bi bi-house-gear-fill display-3 mb-3 ${theme === 'dark' ? 'text-light' : 'text-primary'}`}></i>
              <h3 className="h5">3. Task Completed</h3>
              <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                Your chosen helper arrives and completes the task efficiently. Once done, you can manage your past bookings on your dashboard.
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* For Helpers */}
      <Card className={`mb-5 shadow-lg ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
        <Card.Body className="p-4 p-md-5">
          <h2 className={`text-center mb-4 ${theme === 'dark' ? 'text-success' : 'text-primary'}`}>For Helpers: Grow Your Reach</h2>
          <Row className="align-items-center g-4">
            <Col md={4} className="text-center">
              <i className={`bi bi-person-plus-fill display-3 mb-3 ${theme === 'dark' ? 'text-light' : 'text-primary'}`}></i>
              <h3 className="h5">1. Register & Complete Profile</h3>
              <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                Sign up as a Service Provider. After logging in, fill out your comprehensive helper profile with your services, experience, rates, and availability. This helps customers find you.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <i className={`bi bi-bell-fill display-3 mb-3 ${theme === 'dark' ? 'text-light' : 'text-primary'}`}></i>
              <h3 className="h5">2. Receive Tasks</h3>
              <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                Customers will find you based on your profile and send booking requests. You'll see new tasks appear on your Helper Dashboard.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <i className={`bi bi-check-circle-fill display-3 mb-3 ${theme === 'dark' ? 'text-light' : 'text-primary'}`}></i>
              <h3 className="h5">3. Manage & Complete</h3>
              <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                Manage your assigned tasks directly from your dashboard. Confirm, complete, or cancel bookings. Build your reputation with every successful job!
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="text-center mt-5">
        <p className={`lead ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
          My Personal Helper is designed to make daily tasks simple and reliable for everyone in Tier-2/Tier-3 cities across India.
        </p>
      </div>
    </Container>
  );
};

export default HowItWorksPage;