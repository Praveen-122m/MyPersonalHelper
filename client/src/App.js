import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HelperProfilePage from './pages/HelperProfilePage';
import HelperListPage from './pages/HelperListPage';
import SingleHelperPage from './pages/SingleHelperPage';
import UserDashboard from './pages/UserDashboard';
import HelperDashboard from './pages/HelperDashboard';
import UserProfilePage from './pages/UserProfilePage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
// No AdminDashboard import needed
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen d-flex flex-column">
        <Navbar expand="lg" bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to="/" className={theme === 'dark' ? 'text-warning' : 'text-primary'}>
              My Personal Helper
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/services" className={theme === 'dark' ? 'text-light' : 'text-dark'}>Services</Nav.Link>
                <Nav.Link as={Link} to="/how-it-works" className={theme === 'dark' ? 'text-light' : 'text-dark'}>How It Works</Nav.Link>
                <Nav.Link as={Link} to="/about" className={theme === 'dark' ? 'text-light' : 'text-dark'}>About</Nav.Link>
              </Nav>
              <Nav>
                <Button variant="link" onClick={toggleTheme} className={`me-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
                  {theme === 'dark' ? (
                    <i className="bi bi-moon-fill"></i>
                  ) : (
                    <i className="bi bi-sun-fill"></i>
                  )}
                </Button>

                {userInfo ? (
                  <>
                    <Navbar.Text className={`me-3 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
                      Welcome, <span className="fw-bold text-primary">{userInfo.name.split(' ')[0]}</span>!
                    </Navbar.Text>
                    {userInfo.role === 'helper' && (
                      <Nav.Link as={Link} to="/helper-dashboard" className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                        My Tasks
                      </Nav.Link>
                    )}
                    {userInfo.role === 'user' && (
                      <Nav.Link as={Link} to="/user-dashboard" className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                        My Bookings
                      </Nav.Link>
                    )}
                    {/* No admin link */}
                    <Nav.Link as={Link} to="/profile" className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                        Profile
                    </Nav.Link>
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login" className={`me-2 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Login</Nav.Link>
                    <Button as={Link} to="/register" variant="warning">Register</Button>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <main className={`flex-grow-1 py-4 ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
          <Container>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage setUserInfo={setUserInfo} />} />
              <Route path="/register" element={<RegisterPage setUserInfo={setUserInfo} />} />
              <Route path="/helper-profile" element={<HelperProfilePage />} />
              <Route path="/services" element={<HelperListPage />} />
              <Route path="/helpers/:id" element={<SingleHelperPage />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/helper-dashboard" element={<HelperDashboard />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* No Admin Dashboard Route */}
              {/* <Route path="/admin-dashboard" element={<div className="text-center py-5"><h2>Admin Dashboard Coming Soon!</h2></div>} /> */}
            </Routes>
          </Container>
        </main>

        <footer className={`py-3 text-center ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-muted'}`}>
            <Container>
                &copy; {new Date().getFullYear()} My Personal Helper. All rights reserved.
            </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;