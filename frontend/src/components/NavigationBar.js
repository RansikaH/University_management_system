import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>🎓 University Course Management</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/courses">
              <Nav.Link>Courses</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/students">
              <Nav.Link>Students</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/registrations">
              <Nav.Link>Registrations</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/results">
              <Nav.Link>Results</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/transcript">
              <Nav.Link>Transcript</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/course-results">
              <Nav.Link>Course Analysis</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
