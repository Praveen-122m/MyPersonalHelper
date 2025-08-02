import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const HelperListPage = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('Pali');
  const [service, setService] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [areaOfOperation, setAreaOfOperation] = useState('');
  const [availability, setAvailability] = useState('');

  const serviceCategories = ['Electrician', 'Plumber', 'Carpenter', 'Home Cleaning', 'Appliance Repair', 'Painter', 'AC Service', 'Pest Control', 'Other'];
  const availabilityOptions = ['Full-time', 'Part-time', 'Weekends Only', 'On-Call'];
  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '4', label: '4 Stars & Up' },
    { value: '3', label: '3 Stars & Up' },
    { value: '2', label: '2 Stars & Up' },
    { value: '1', label: '1 Star & Up' },
  ];

  useEffect(() => {
    const fetchHelpers = async () => {
      setLoading(true);
      setError('');
      try {
        const queryParams = new URLSearchParams(location.search);
        setKeyword(queryParams.get('keyword') || '');
        setCity(queryParams.get('city') || 'Pali');
        setService(queryParams.get('service') || '');
        setMinRating(queryParams.get('minRating') || '');
        setMinExperience(queryParams.get('minExperience') || '');
        setAreaOfOperation(queryParams.get('areaOfOperation') || '');
        setAvailability(queryParams.get('availability') || '');

        const queryString = queryParams.toString();
        const apiUrl = `http://localhost:5000/api/helpers?${queryString}`;

        const { data } = await axios.get(apiUrl);
        setHelpers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load helpers. Please try again later.');
        setLoading(false);
      }
    };
    fetchHelpers();
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (city) params.append('city', city);
    if (service) params.append('service', service);
    if (minRating) params.append('minRating', minRating);
    if (minExperience) params.append('minExperience', minExperience);
    if (areaOfOperation) params.append('areaOfOperation', areaOfOperation);
    if (availability) params.append('availability', availability);

    navigate(`/services?${params.toString()}`);
  };

  const handleClearFilters = () => {
      setKeyword(''); setCity('Pali'); setService(''); setMinRating('');
      setMinExperience(''); setAreaOfOperation(''); setAvailability('');
      navigate('/services');
  };

  const cardBgClass = theme === 'dark' ? 'bg-secondary' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-light' : 'text-dark';
  const mutedTextClass = theme === 'dark' ? 'text-light-50' : 'text-muted';
  const inputClass = theme === 'dark' ? 'bg-dark text-light border-secondary' : '';
  const labelClass = theme === 'dark' ? 'text-light' : 'text-dark';

  return (
    <Container className="py-5">
      <h1 className={`text-center mb-5 ${textClass}`}>Explore Local Helpers</h1>

      <Row>
        <Col lg={3} className="mb-4">
          <Card className={`p-4 ${cardBgClass} shadow-sm sticky-top`} style={{top: '20px'}}>
            <h2 className={`mb-4 ${textClass}`}>Filters</h2>
            <Form onSubmit={handleSearchSubmit}>
                <Form.Group className="mb-3" controlId="keyword">
                    <Form.Label className={labelClass}>Keyword (Name/Bio)</Form.Label>
                    <Form.Control type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g., Ramesh, reliable" className={inputClass} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="city">
                    <Form.Label className={labelClass}>City</Form.Label>
                    <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Pali" required className={inputClass} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="service">
                    <Form.Label className={labelClass}>Service Category</Form.Label>
                    <Form.Select value={service} onChange={(e) => setService(e.target.value)} className={inputClass}>
                        <option value="">All Services</option>
                        {serviceCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="minRating">
                    <Form.Label className={labelClass}>Minimum Rating</Form.Label>
                    <Form.Select value={minRating} onChange={(e) => setMinRating(e.target.value)} className={inputClass}>
                        {ratingOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="minExperience">
                    <Form.Label className={labelClass}>Min. Experience (Years)</Form.Label>
                    <Form.Control type="number" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} placeholder="e.g., 2" min="0" className={inputClass} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="areaOfOperation">
                    <Form.Label className={labelClass}>Area of Operation (Locality)</Form.Label>
                    <Form.Control type="text" value={areaOfOperation} onChange={(e) => setAreaOfOperation(e.target.value)} placeholder="e.g., Housing Board" className={inputClass} />
                </Form.Group>
                <Form.Group className="mb-4" controlId="availability">
                    <Form.Label className={labelClass}>Availability</Form.Label>
                    <Form.Select value={availability} onChange={(e) => setAvailability(e.target.value)} className={inputClass}>
                        <option value="">Any Availability</option>
                        {availabilityOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant={theme === 'dark' ? 'warning' : 'primary'} type="submit" className="w-100 mb-2">
                  Apply Filters
                </Button>
                <Button variant="link" onClick={handleClearFilters} className={`w-100 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                  Clear Filters
                </Button>
            </Form>
          </Card>
        </Col>

        <Col lg={9}>
          {loading ? (
            <Alert variant="info" className="text-center">Loading helpers...</Alert>
          ) : error ? (
            <Alert variant="danger" className="text-center">{error}</Alert>
          ) : helpers.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h2 className="mb-2">No Helpers Found</h2>
              <p>Try adjusting your filters or check back later!</p>
            </Alert>
          ) : (
            <Row xs={1} md={2} xl={3} className="g-4">
              {helpers.map((helper) => (
                <Col key={helper._id}>
                  <Card className={`h-100 shadow-sm ${cardBgClass}`}>
                    <Card.Img variant="top" src={helper.profilePicture || '/images/default_avatar.png'} alt={helper.name} style={{height: '150px', objectFit: 'cover', borderBottom: `1px solid ${theme === 'dark' ? '#444' : '#eee'}`}} />
                    <Card.Body className="d-flex flex-column">
                      <h4 className={`card-title text-center mb-1 ${textClass}`}>
                        {helper.name}
                        {helper.isProfileComplete && (
                            <span className="badge bg-success ms-2 fs-6">Verified</span>
                        )}
                        {helper.isIdentityVerified && (
                            <span className="badge bg-primary ms-2 fs-6">
                                <i className="bi bi-patch-check-fill me-1"></i> ID Verified
                            </span>
                        )}
                      </h4>
                      <p className={`card-subtitle text-center mb-2 ${mutedTextClass}`}>
                        {helper.services.length > 0 ? helper.services.join(', ') : 'No services listed'}
                      </p>
                      <Card.Text className={`text-center text-sm ${mutedTextClass}`}>
                        {helper.city}, {helper.state} | Exp: {helper.experience} Yrs
                      </Card.Text>
                      <Card.Text className={`text-center text-sm ${mutedTextClass}`}>
                        Rating: {helper.averageRating.toFixed(1)} ({helper.numReviews} Reviews)
                      </Card.Text>
                      <Card.Text className={`text-center fs-5 fw-bold mt-2 ${textClass}`}>
                          Hourly Rate: ₹{helper.hourlyRate || 'N/A'}
                      </Card.Text>
                      <div className="mt-auto d-grid gap-2"> {/* Use d-grid for stacked buttons */}
                        <Button as={Link} to={`/helpers/${helper._id.toString()}`} variant={theme === 'dark' ? 'warning' : 'primary'} className="w-100">
                          View Profile
                        </Button>
                        {/* NEW: Chat on WhatsApp Icon on Helper List Card */}
                        {helper.phone && (
                            <Button 
                                as="a" 
                                href={`https://wa.me/91${helper.phone}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                variant="success" 
                                size="sm" // Smaller button for card
                                className="w-100"
                            >
                                <i className="bi bi-whatsapp me-1"></i> Chat
                            </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HelperListPage;