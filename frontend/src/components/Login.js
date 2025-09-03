import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { authAPI, tokenService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

    try {
      const response = await authAPI.login(formData);
      const { token, ...userInfo } = response.data;
      
      // If this is a student, ensure we have the student ID
      if (userInfo.role === 'STUDENT' && response.data.studentId) {
        userInfo.student = { id: response.data.studentId };
      }
      
      // Store token and user info
      tokenService.setToken(token);
      tokenService.setUser(userInfo);
      
      // Call parent callback if provided
      if (onLogin) {
        onLogin(userInfo);
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Header className="text-center bg-primary text-white">
              <h4>University Management System</h4>
              <p className="mb-0">Login to your account</p>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username / Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username or student ID"
                    autoComplete="username"
                  />
                  <Form.Text className="text-muted">
                    Staff: Use username | Students: Use Student ID
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    size="lg"
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
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>
              </Form>

              <hr />
              
              <div className="text-center mt-4">
                <div className="border-top pt-3">
                  <p className="text-muted mb-2">Don't have an account?</p>
                  <div className="d-grid gap-2">
                    <Link to="/register/student" className="btn btn-outline-primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Register as Student
                    </Link>
                    <Link to="/register" className="btn btn-outline-secondary">
                      <i className="bi bi-briefcase me-2"></i>
                      Register as Staff
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Contact your administrator if you need assistance with login credentials
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
