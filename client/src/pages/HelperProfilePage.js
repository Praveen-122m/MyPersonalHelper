import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const HelperProfilePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '',
    profilePicture: '', bio: '', services: [], experience: '', hourlyRate: '',
    areaOfOperation: [], availability: 'Full-time',
    aadhaarNumber: '', idProofUrl: '',
  });

  const [profilePictureFile, setProfilePictureFile] = useState(null); 
  const [idProofFrontFile, setIdProofFrontFile] = useState(null); 
  const [idProofBackFile, setIdProofBackFile] = useState(null); 
  
  // NEW STATE: For image preview
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedInfo);

      if (parsedInfo.role !== 'helper') {
        setError('You are not authorized to view this page.');
        setLoading(false);
        navigate('/');
        return;
      }

      const fetchProfile = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${parsedInfo.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/helpers/profile', config);
          setFormData({
            name: data.name || '', email: data.email || '', phone: data.phone || '',
            address: data.address || '', city: data.city || '', state: data.state || '',
            profilePicture: data.profilePicture || '', bio: data.bio || '',
            services: data.services || [], experience: data.experience || '',
            hourlyRate: data.hourlyRate || '', areaOfOperation: data.areaOfOperation || [],
            availability: data.availability || 'Full-time',
            aadhaarNumber: data.aadhaarNumber || '', 
            idProofUrl: data.idProofUrl || '',
          });
          setLoading(false);
        } catch (err) {
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
  }, [navigate]);

  // NEW useEffect for preview cleanup
  useEffect(() => {
    // Cleanup function to revoke the object URL when component unmounts or preview changes
    return () => {
      if (profilePicturePreviewUrl) {
        URL.revokeObjectURL(profilePicturePreviewUrl);
      }
    };
  }, [profilePicturePreviewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFileState, setPreviewUrlState = null) => {
    const file = e.target.files[0];
    setFileState(file); // Set the File object

    // Create and set preview URL if a file is selected and a preview state setter is provided
    if (setPreviewUrlState) {
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrlState(url);
      } else {
        setPreviewUrlState(null); // Clear preview if no file selected
      }
    }
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.split(',').map(item => item.trim()).filter(item => item !== '') }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const dataToSend = { ...formData };
    dataToSend.services = formData.services.join(','); 
    dataToSend.areaOfOperation = formData.areaOfOperation.join(',');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put('http://localhost:5000/api/helpers/profile', dataToSend, config); 
      setSuccess('Profile updated successfully!');
      const updatedUserInfo = { ...userInfo, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
      // Reset file input states (important for re-uploading same file)
      setProfilePictureFile(null);
      setIdProofFrontFile(null);
      setIdProofBackFile(null);
      setProfilePicturePreviewUrl(null); // Clear preview after submission
    } catch (err) {
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
          <h2 className="text-center mb-4">
            {userInfo?.isProfileComplete ? "Update Your Helper Profile" : "Complete Your Helper Profile"}
          </h2>
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
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} disabled />
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

            <h4 className="mb-3 mt-4 text-primary">Helper Details</h4>
            <Form.Group className="mb-3" controlId="profilePicture">
                <Form.Label className={labelClass}>Current Profile Picture</Form.Label>
                {/* Display current saved profile picture OR default avatar */}
                {(formData.profilePicture && formData.profilePicture !== 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Avatar') && (
                    <div className="mb-2">
                        <img src={formData.profilePicture} alt="Current Profile" className="img-fluid rounded-circle" style={{width: '100px', height: '100px', objectFit: 'cover', border: `2px solid ${theme === 'dark' ? '#ffc107' : '#0d6efd'}`}} />
                    </div>
                )}
                {/* NEW: Display live preview of selected file OR fallback to current/default */}
                {profilePicturePreviewUrl ? (
                    <div className="mb-2">
                        <img src={profilePicturePreviewUrl} alt="New Profile Preview" className="img-fluid rounded-circle" style={{width: '100px', height: '100px', objectFit: 'cover', border: `2px solid ${theme === 'dark' ? '#ffc107' : '#0d6efd'}`}} />
                    </div>
                ) : ( // Show default if no current saved pic and no new pic selected
                    !formData.profilePicture && (
                        <div className="mb-2">
                            <img src='https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Avatar' alt="Default Profile" className="img-fluid rounded-circle" style={{width: '100px', height: '100px', objectFit: 'cover', border: `2px solid ${theme === 'dark' ? '#ffc107' : '#0d6efd'}`}} />
                        </div>
                    )
                )}

                <Form.Label className={labelClass}>Upload New Profile Picture (Image File)</Form.Label>
                <Form.Control 
                    type="file" 
                    onChange={(e) => handleFileChange(e, setProfilePictureFile, setProfilePicturePreviewUrl)} // Pass preview setter
                    className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''} 
                    accept="image/*"
                />
                {profilePictureFile && <Form.Text className={labelClass}>Selected: {profilePictureFile.name}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="bio">
              <Form.Label className={labelClass}>Bio (Max 500 chars)</Form.Label>
              <Form.Control as="textarea" rows="4" name="bio" value={formData.bio} onChange={handleChange} maxLength="500" placeholder="Tell customers about your skills and experience..." className={inputClass}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="services">
              <Form.Label className={labelClass}>Services Offered (Comma-separated)</Form.Label>
              <Form.Control type="text" name="services" value={formData.services.join(', ')} onChange={handleArrayChange} placeholder="e.g., Electrician, Plumber, AC Repair" className={inputClass} />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="experience">
                <Form.Label className={labelClass}>Years of Experience</Form.Label>
                <Form.Control type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" className={inputClass} /> 
              </Form.Group>
              <Form.Group as={Col} controlId="hourlyRate">
                <Form.Label className={labelClass}>Hourly Rate (₹)</Form.Label>
                <Form.Control type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} min="0" className={inputClass} /> 
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Form.Group as={Col} controlId="areaOfOperation">
                <Form.Label className={labelClass}>Areas of Operation (Comma-separated localities in {formData.city})</Form.Label>
                <Form.Control type="text" name="areaOfOperation" value={formData.areaOfOperation.join(', ')} onChange={handleArrayChange} placeholder="e.g., Housing Board, Mandiya Road, Surajpol" className={inputClass} />
              </Form.Group>
              <Form.Group as={Col} controlId="availability">
                <Form.Label className={labelClass}>Availability</Form.Label>
                <Form.Select name="availability" value={formData.availability} onChange={handleChange} className={inputClass}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Weekends Only">Weekends Only</option>
                  <option value="On-Call">On-Call</option>
                </Form.Select>
              </Form.Group>
            </Row>

            {/* --- IDENTITY VERIFICATION FIELDS (URL INPUTS) --- */}
            <h4 className="mb-3 mt-4 text-primary">Identity Verification (Demo)</h4>
            <Alert variant={formData.isIdentityVerified ? "success" : "warning"} className="mb-3">
                {formData.isIdentityVerified ? 
                    <> <i className="bi bi-patch-check-fill me-2"></i> Identity Verified by Admin (Cannot be changed here) </> : 
                    <> <i className="bi bi-exclamation-triangle-fill me-2"></i> Status: Pending Admin Verification </>
                }
            </Alert>
            <Form.Group className="mb-3" controlId="aadhaarNumber">
                <Form.Label className={labelClass}>Aadhaar Number (12 Digits)</Form.Label>
                <Form.Control 
                    type="text" 
                    name="aadhaarNumber" 
                    value={formData.aadhaarNumber} 
                    onChange={handleChange} 
                    placeholder="e.g., 123456789012" 
                    required 
                    className={inputClass} 
                    maxLength="12" 
                    minLength="12"
                />
            </Form.Group>
            <Form.Group className="mb-4" controlId="idProofUrl">
                <Form.Label className={labelClass}>ID Proof Document URL (e.g., Aadhaar Card Photo)</Form.Label>
                {formData.idProofUrl && ( 
                    <div className="mb-2">
                        <img src={formData.idProofUrl} alt="ID Proof Preview" className="img-fluid rounded" style={{maxWidth: '200px', border: `1px solid ${theme === 'dark' ? '#ffc107' : '#0d6efd'}`}} />
                    </div>
                )}
                {/* This input will now be a file type */}
                <Form.Control 
                    type="file" 
                    onChange={(e) => handleFileChange(e, setIdProofFrontFile)} // We'll reuse this for a single ID proof file input
                    className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''} 
                    accept="image/*"
                />
                {idProofFrontFile && <Form.Text className={labelClass}>Selected: {idProofFrontFile.name}</Form.Text>}
            </Form.Group>

            <Button variant={theme === 'dark' ? 'warning' : 'primary'} type="submit" className="w-100">
              Save Profile
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HelperProfilePage;