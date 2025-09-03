import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '../services/api';

const NavigationBar = ({ onLogout }) => {
  const user = tokenService.getUser();
  const isAuthenticated = !!tokenService.getToken();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback if onLogout is not provided
      tokenService.clearAuth();
      window.location.href = '/login';
    }
  };

  const canAccess = (roles) => {
    return user && roles.includes(user.role);
  };

  if (!isAuthenticated) {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <LinkContainer to="/login">
            <Navbar.Brand>🎓 University Management System</Navbar.Brand>
          </LinkContainer>
          <Nav className="ms-auto">
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register">
              <Nav.Link>Register</Nav.Link>
            </LinkContainer>
          </Nav>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/dashboard">
          <Navbar.Brand>🎓 University Management System</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/dashboard">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            
            {canAccess(['ADMIN', 'INSTRUCTOR', 'STUDENT', 'REGISTRAR']) && (
              <LinkContainer to="/courses">
                <Nav.Link>Courses</Nav.Link>
              </LinkContainer>
            )}
            
            {canAccess(['ADMIN', 'INSTRUCTOR', 'REGISTRAR']) && (
              <LinkContainer to="/students">
                <Nav.Link>Students</Nav.Link>
              </LinkContainer>
            )}
            
            {canAccess(['ADMIN', 'INSTRUCTOR', 'REGISTRAR']) && (
              <LinkContainer to="/registrations">
                <Nav.Link>Registrations</Nav.Link>
              </LinkContainer>
            )}
            
            {canAccess(['ADMIN', 'INSTRUCTOR', 'STUDENT']) && (
              <LinkContainer to="/results">
                <Nav.Link>Results</Nav.Link>
              </LinkContainer>
            )}
            
            {canAccess(['ADMIN', 'INSTRUCTOR', 'STUDENT']) && (
              <LinkContainer to="/transcript">
                <Nav.Link>Transcript</Nav.Link>
              </LinkContainer>
            )}
            
            {canAccess(['ADMIN', 'INSTRUCTOR']) && (
              <LinkContainer to="/course-results">
                <Nav.Link>Course Analysis</Nav.Link>
              </LinkContainer>
            )}
            
            {canAccess(['ADMIN']) && (
              <NavDropdown title="Admin" id="admin-dropdown">
                <LinkContainer to="/users">
                  <NavDropdown.Item>User Management</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/system-stats">
                  <NavDropdown.Item>System Statistics</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
          
          <Nav>
            <NavDropdown title={`${user.firstName} ${user.lastName} (${user.role})`} id="user-dropdown">
              <NavDropdown.Item disabled>
                <small className="text-muted">{user.email}</small>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <LinkContainer to="/profile">
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
