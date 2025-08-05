import React, { useState, useEffect } from 'react'; // Added useEffect for cleanup
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const RegisterPage = ({ setUserInfo }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Helper-specific fields
  const [services, setServices] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [areaOfOperation, setAreaOfOperation] = useState('');
  
  // File objects for upload
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null); 
  const [idProofFile, setIdProofFile] = useState(null); // Single ID proof file

  // NEW STATE: For image previews
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] = useState(null);
  const [idProofPreviewUrl, setIdProofPreviewUrl] = useState(null);

  // NEW useEffect for preview cleanup
  useEffect(() => {
    return () => {
      if (profilePicturePreviewUrl) {
        URL.revokeObjectURL(profilePicturePreviewUrl);
      }
      if (idProofPreviewUrl) {
        URL.revokeObjectURL(idProofPreviewUrl);
      }
    };
  }, [profilePicturePreviewUrl, idProofPreviewUrl]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // NEW: Use FormData for file uploads
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('city', 'Pali'); // Hardcode city/state for now
    formData.append('state', 'Rajasthan');

    if (role === 'helper') {
      formData.append('services', services);
      formData.append('experience', experience);
      formData.append('bio', bio);
      formData.append('hourlyRate', hourlyRate);
      formData.append('areaOfOperation', areaOfOperation);
      
      if (aadhaarNumber) formData.append('aadhaarNumber', aadhaarNumber);
      if (profilePictureFile) formData.append('profilePicture', profilePictureFile);
      if (idProofFile) formData.append('idProof', idProofFile); // Single ID proof file
    }

    try {
      const config = {
        headers: {
          // No Content-Type for FormData
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData, 
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      setSuccess('Registration successful! You are now logged in. Redirecting...');

      // Clear previews after successful registration
      setProfilePicturePreviewUrl(null);
      setIdProofPreviewUrl(null);

      navigate('/');

    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : 'Registration failed. Please try again.');
    }
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

  const inputClass = theme === 'dark' ? 'bg-dark text-light border-secondary' : '';
  const labelClass = theme === 'dark' ? 'text-light' : 'text-dark';

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card className={`shadow-lg p-4 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white'}`} style={{ maxWidth: '600px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Create Your Account</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={submitHandler}> 
            <Row className="mb-3">
              <Form.Group as={Col} controlId="name">
                <Form.Label className={labelClass}>Full Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
              </Form.Group>
              <Form.Group as={Col} controlId="email">
                <Form.Label className={labelClass}>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="phone">
                <Form.Label className={labelClass}>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} />
              </Form.Group>
              <Form.Group as={Col} controlId="address">
                <Form.Label className={labelClass}>Address (Optional)</Form.Label>
                <Form.Control type="text" placeholder="e.g., House No., Street, Locality" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label className={labelClass}>Registering as:</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
                <option value="user">Customer</option>
                <option value="helper">Service Provider (Helper)</option>
              </Form.Select>
            </Form.Group>

            {role === 'helper' && (
              <Card className={`p-4 mb-4 ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
                <h4 className="mb-3 text-center text-primary">Service Provider Details</h4>
                <Form.Group className="mb-3" controlId="profilePictureFile">
                    <Form.Label className={labelClass}>Profile Picture</Form.Label>
                    <Form.Control 
                        type="file" 
                        onChange={(e) => handleFileChange(e, setProfilePictureFile, setProfilePicturePreviewUrl)} // Pass preview setter
                        className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''} 
                        accept="image/*"
                    />
                    {profilePictureFile && <Form.Text className={labelClass}>Selected: {profilePictureFile.name}</Form.Text>}
                    {profilePicturePreviewUrl && ( // Display live preview
                        <div className="mt-2">
                            <img src={profilePicturePreviewUrl} alt="Profile Preview" className="img-fluid rounded-circle" style={{width: '100px', height: '100px', objectFit: 'cover', border: `2px solid ${theme === 'dark' ? '#ffc107' : '#0d6efd'}`}} />
                        </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="services">
                  <Form.Label className={labelClass}>Services Offered (Comma-separated)</Form.Label>
                  <Form.Control type="text" placeholder="e.g., Electrician, Plumber" value={services} onChange={(e) => setServices(e.target.value)} className={inputClass} />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="experience">
                    <Form.Label className={labelClass}>Years of Experience</Form.Label>
                    <Form.Control type="number" placeholder="e.g., 5" value={experience} onChange={(e) => setExperience(e.target.value)} min="0" className={inputClass} />
                  </Form.Group>
                  <Form.Group as={Col} controlId="hourlyRate">
                    <Form.Label className={labelClass}>Hourly Rate (₹)</Form.Label>
                    <Form.Control type="number" placeholder="e.g., 300" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} min="0" className={inputClass} />
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3" controlId="bio">
                  <Form.Label className={labelClass}>Bio (Tell us about yourself)</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="e.g., Certified electrician with 10 years experience." value={bio} onChange={(e) => setBio(e.target.value)} maxLength="500" className={inputClass} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="areaOfOperation">
                  <Form.Label className={labelClass}>Areas of Operation</Form.Label>
                  <Form.Control type="text" placeholder="e.g., Housing Board, Mandiya Road" value={areaOfOperation} onChange={(e) => setAreaOfOperation(e.target.value)} className={inputClass} />
                </Form.Group>

                {/* NEW: Identity Verification File Uploads */}
                <h5 className={`mt-4 mb-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Identity Verification (Upload Photo)</h5>
                <Form.Group className="mb-3" controlId="aadhaarNumber">
                    <Form.Label className={labelClass}>Aadhaar Number (12 Digits)</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter 12-digit Aadhaar number" 
                        value={aadhaarNumber} 
                        onChange={(e) => setAadhaarNumber(e.target.value)} 
                        required={role === 'helper'} 
                        className={inputClass} 
                        maxLength="12" 
                        minLength="12"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="idProofFile"> {/* Single ID Proof File Input */}
                    <Form.Label className={labelClass}>ID Proof Photo (e.g., Aadhaar Card)</Form.Label>
                    <Form.Control 
                        type="file" 
                        onChange={(e) => handleFileChange(e, setIdProofFile, setIdProofPreviewUrl)} // Pass preview setter
                        required={role === 'helper'} 
                        className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''} 
                        accept="image/*"
                    />
                     {idProofFile && <Form.Text className={labelClass}>Selected: {idProofFile.name}</Form.Text>}
                     {idProofPreviewUrl && ( // Display live preview
                        <div className="mt-2">
                            <img src={idProofPreviewUrl} alt="ID Proof Preview" className="img-fluid rounded" style={{maxWidth: '200px', border: `2px solid ${theme === 'dark' ? '#ffc107' : '#0d6efd'}`}} />
                        </div>
                    )}
                </Form.Group>
              </Card>
            )}

            <Row className="mb-4">
              <Form.Group as={Col} controlId="password">
                <Form.Label className={labelClass}>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
              </Form.Group>
              <Form.Group as={Col} controlId="confirmPassword">
                <Form.Label className={labelClass}>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
              </Form.Group>
            </Row>

            <Button variant={theme === 'dark' ? 'success' : 'primary'} type="submit" className="w-100 mb-3">
              Register
            </Button>
          </Form>
          <p className={`text-center mt-3 ${theme === 'dark' ? 'text-light-50' : 'text-muted'}`}>
            Already have an account? <Link to="/login" className={theme === 'dark' ? 'text-warning' : 'text-primary'}>Login Here</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;