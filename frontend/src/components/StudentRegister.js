import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        studentId: formData.studentId,
        password: formData.password
      };
      
      await authAPI.registerStudent(registrationData);
      
      setSuccess('Student account created successfully! You can now login with your Student ID.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card>
            <Card.Header className="text-center bg-success text-white">
              <h4><i className="bi bi-mortarboard-fill me-2"></i>Student Registration</h4>
              <p className="mb-0">Create your university account</p>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-person-badge me-1"></i>Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    placeholder="Enter your university student ID"
                    autoComplete="username"
                  />
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Use the Student ID provided by the university registrar
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-lock me-1"></i>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                  />
                  <Form.Text className="text-muted">
                    Minimum 6 characters required
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label><i className="bi bi-lock-fill me-1"></i>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Your Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <div className="border-top pt-3">
                  <p className="text-muted mb-2">Already have an account?</p>
                  <Link to="/login" className="btn btn-outline-primary">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In Instead
                  </Link>
                </div>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-briefcase me-1"></i>
                  Staff member? <Link to="/register">Register as Staff</Link>
                </small>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Your student information is secure and confidential
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentRegister;
