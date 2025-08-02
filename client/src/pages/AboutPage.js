import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const AboutPage = () => {
  const { theme } = useTheme();

  return (
    <Container className="py-5">
      <h1 className={`text-center mb-5 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>About My Personal Helper</h1>

      <Row className="justify-content-center mb-4">
        <Col md={10}>
          <Card className={`shadow-lg ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
            <Card.Body className="p-4 p-md-5">
              <h2 className={`mb-4 ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}>Our Mission</h2>
              <p className={`lead ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
                My Personal Helper was born from a simple idea: to bridge the gap between people who need help with daily tasks and the skilled local professionals who can provide it, especially in India's growing Tier-2 and Tier-3 cities. We understand the challenges of finding reliable and trusted services like electricians, plumbers, and carpenters quickly.
              </p>
              <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                Our mission is to simplify this process, offering a convenient, transparent, and trustworthy platform that empowers both customers and service providers. No more endless searching or relying solely on word-of-mouth; just quick, efficient connections.
              </p>

              <h2 className={`mt-5 mb-4 ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}>What We Offer</h2>
              <ul className={`list-unstyled ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
                <li className="mb-2"><i className="bi bi-check-circle-fill me-2 text-success"></i> **Easy Service Finding:** Search, filter, and discover local helpers by category and location.</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill me-2 text-success"></i> **Trusted Professionals:** Connect with verified and reviewed service providers.</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill me-2 text-success"></i> **Seamless Booking:** Book services directly through the platform with flexible scheduling.</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill me-2 text-success"></i> **Empowering Local Talent:** Provides a platform for skilled individuals to reach more customers and grow their business.</li>
                <li className="mb-2"><i className="bi bi-check-circle-fill me-2 text-success"></i> **Responsive & Accessible:** A web-based platform, no app download needed, accessible on any device.</li>
              </ul>

              <h2 className={`mt-5 mb-4 ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}>Our Vision for India</h2>
              <p className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                We envision a future where finding local help is never a hassle, and local service providers have ample opportunities to showcase their skills and serve their communities efficiently. My Personal Helper is more than just a platform; it's a step towards organized, accessible, and reliable local services across India.
              </p>

              <div className="text-center mt-5">
                <p className={`lead ${theme === 'dark' ? 'text-warning' : 'text-primary'}`}>"Your Local Helper, Just a Click Away."</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;