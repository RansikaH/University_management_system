import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { courseAPI, studentAPI, registrationAPI, resultAPI, tokenService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRegistrations: 0,
    availableCourses: 0,
    totalResults: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const currentUser = tokenService.getUser();
    setUser(currentUser);

    const fetchStats = async () => {
      try {
        console.log('Fetching dashboard stats...');
        const [coursesRes, studentsRes, registrationsRes, availableRes, resultsRes] = await Promise.all([
          courseAPI.getAll(),
          studentAPI.getAll(),
          registrationAPI.getAll(),
          courseAPI.getAvailable(),
          resultAPI.getAll()
        ]);

        console.log('Dashboard API responses:', {
          courses: coursesRes.data,
          students: studentsRes.data,
          registrations: registrationsRes.data,
          available: availableRes.data,
          results: resultsRes.data
        });

        setStats({
          totalCourses: coursesRes.data.length,
          totalStudents: studentsRes.data.length,
          totalRegistrations: registrationsRes.data.length,
          availableCourses: availableRes.data.length,
          totalResults: resultsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        console.error('Error details:', error.response);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Role-based helper functions
  const canManageStudents = user && (user.role === 'ADMIN' || user.role === 'REGISTRAR');
  const canManageCourses = user && (user.role === 'ADMIN' || user.role === 'INSTRUCTOR');
  const canManageRegistrations = user && (user.role === 'ADMIN' || user.role === 'REGISTRAR');

  return (
    <div>
      {/* Personalized Welcome Header */}
      <div className="mb-4">
        <h1 className="mb-2">
          <i className="bi bi-house-door me-2 text-primary"></i>
          Welcome back, {user ? user.username : 'User'}!
        </h1>
        <p className="text-muted">
          <i className="bi bi-person-badge me-2"></i>
          Role: <span className="fw-bold text-capitalize">{user ? user.role.toLowerCase() : 'Loading...'}</span>
        </p>
      </div>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-book text-primary fs-2"></i>
              </div>
              <Card.Title>
                <Badge bg="primary" className="fs-4">{stats.totalCourses}</Badge>
              </Card.Title>
              <Card.Text className="text-muted">Total Courses</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-people text-success fs-2"></i>
              </div>
              <Card.Title>
                <Badge bg="success" className="fs-4">{stats.totalStudents}</Badge>
              </Card.Title>
              <Card.Text className="text-muted">Total Students</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-clipboard-check text-info fs-2"></i>
              </div>
              <Card.Title>
                <Badge bg="info" className="fs-4">{stats.totalRegistrations}</Badge>
              </Card.Title>
              <Card.Text className="text-muted">Total Registrations</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-calendar-check text-warning fs-2"></i>
              </div>
              <Card.Title>
                <Badge bg="warning" className="fs-4">{stats.availableCourses}</Badge>
              </Card.Title>
              <Card.Text className="text-muted">Available Courses</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-trophy text-dark fs-2"></i>
              </div>
              <Card.Title>
                <Badge bg="dark" className="fs-4">{stats.totalResults}</Badge>
              </Card.Title>
              <Card.Text className="text-muted">Total Results</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2 text-primary"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {canManageStudents && (
                  <Col md={4} className="mb-3">
                    <div className="d-grid">
                      <Button as={Link} to="/add-student" variant="outline-success" size="lg">
                        <i className="bi bi-person-plus me-2"></i>
                        Add New Student
                      </Button>
                    </div>
                  </Col>
                )}
                {canManageCourses && (
                  <Col md={4} className="mb-3">
                    <div className="d-grid">
                      <Button as={Link} to="/add-course" variant="outline-primary" size="lg">
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Course
                      </Button>
                    </div>
                  </Col>
                )}
                {canManageRegistrations && (
                  <Col md={4} className="mb-3">
                    <div className="d-grid">
                      <Button as={Link} to="/registrations" variant="outline-info" size="lg">
                        <i className="bi bi-clipboard-plus me-2"></i>
                        Manage Registrations
                      </Button>
                    </div>
                  </Col>
                )}
                {user && user.role === 'STUDENT' ? (
                  <>
                    <Col md={4} className="mb-3">
                      <div className="d-grid">
                        <Button as={Link} to="/courses" variant="outline-primary" size="lg">
                          <i className="bi bi-book me-2"></i>
                          View Courses
                        </Button>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="d-grid">
                        <Button as={Link} to="/results" variant="outline-warning" size="lg">
                          <i className="bi bi-graph-up me-2"></i>
                          View Results
                        </Button>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="d-grid">
                        <Button as={Link} to="/transcript" variant="outline-success" size="lg">
                          <i className="bi bi-file-earmark-text me-2"></i>
                          My Transcript
                        </Button>
                      </div>
                    </Col>
                  </>
                ) : user && user.role === 'REGISTRAR' ? (
                  <Col md={4} className="mb-3">
                    <div className="d-grid">
                      <Button as={Link} to="/courses" variant="outline-secondary" size="lg">
                        <i className="bi bi-book me-2"></i>
                        View Courses
                      </Button>
                    </div>
                  </Col>
                ) : (
                  <Col md={4} className="mb-3">
                    <div className="d-grid">
                      <Button as={Link} to="/results" variant="outline-warning" size="lg">
                        <i className="bi bi-graph-up me-2"></i>
                        View Results
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Role-Specific Information */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Your Dashboard
              </h5>
            </Card.Header>
            <Card.Body>
              {user && user.role === 'ADMIN' && (
                <div>
                  <h6 className="text-primary">
                    <i className="bi bi-shield-check me-2"></i>
                    Administrator Access
                  </h6>
                  <p className="mb-2">You have full system access. You can manage all aspects of the university system.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge bg="primary">Manage Courses</Badge>
                    <Badge bg="success">Manage Students</Badge>
                    <Badge bg="info">Manage Registrations</Badge>
                    <Badge bg="warning">View Results</Badge>
                    <Badge bg="dark">User Management</Badge>
                  </div>
                </div>
              )}
              {user && user.role === 'INSTRUCTOR' && (
                <div>
                  <h6 className="text-success">
                    <i className="bi bi-mortarboard me-2"></i>
                    Instructor Dashboard
                  </h6>
                  <p className="mb-2">Manage your courses and student grades effectively.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge bg="primary">Manage Courses</Badge>
                    <Badge bg="warning">Grade Students</Badge>
                    <Badge bg="info">View Registrations</Badge>
                  </div>
                </div>
              )}
              {user && user.role === 'REGISTRAR' && (
                <div>
                  <h6 className="text-info">
                    <i className="bi bi-clipboard-data me-2"></i>
                    Registrar Dashboard
                  </h6>
                  <p className="mb-2">Handle student enrollments and manage registration processes.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge bg="success">Manage Students</Badge>
                    <Badge bg="info">Manage Registrations</Badge>
                    <Badge bg="secondary">View Courses</Badge>
                  </div>
                </div>
              )}
              {user && user.role === 'STUDENT' && (
                <div>
                  <h6 className="text-warning">
                    <i className="bi bi-person-circle me-2"></i>
                    Student Portal
                  </h6>
                  <p className="mb-2">Access your academic information and course enrollment.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge bg="primary">View Courses</Badge>
                    <Badge bg="info">My Registrations</Badge>
                    <Badge bg="warning">My Grades</Badge>
                    <Badge bg="success">My Transcript</Badge>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </div>
  );
};

export default Dashboard;
