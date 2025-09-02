import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col, Badge, Alert, Modal } from 'react-bootstrap';
import { courseAPI, registrationAPI, tokenService } from '../services/api';

const StudentCourseEnrollment = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all available courses
      const coursesResponse = await courseAPI.getAll();
      
      // Fetch student's current registrations
      const registrationsResponse = await registrationAPI.getMyRegistrations();
      
      const allCourses = coursesResponse.data;
      const myRegistrations = registrationsResponse.data;
      
      // Separate enrolled and available courses
      const enrolledCourseIds = myRegistrations.map(reg => reg.course.id);
      const enrolled = myRegistrations.map(reg => ({
        ...reg.course,
        registrationStatus: reg.status,
        registrationDate: reg.registrationDate
      }));
      
      const available = allCourses.filter(course => !enrolledCourseIds.includes(course.id));
      
      setEnrolledCourses(enrolled);
      setAvailableCourses(available);
    } catch (error) {
      setError('Failed to fetch course data: ' + error.message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const confirmEnrollment = async () => {
    try {
      setError('');
      setSuccess('');
      
      const user = tokenService.getUser();
      if (!user || !user.student?.id) {
        throw new Error('Student information not found. Please make sure you are logged in as a student.');
      }

      if (!selectedCourse) {
        throw new Error('No course selected for enrollment.');
      }

      const registrationData = {
        studentId: user.student.id,
        courseId: selectedCourse.id,
        status: 'ENROLLED'
      };

      await registrationAPI.create(registrationData);
      
      // Show success message
      setSuccess(`Successfully enrolled in ${selectedCourse.title}!`);
      
      // Close modal and reset state after a short delay
      setTimeout(() => {
        setShowEnrollModal(false);
        setSelectedCourse(null);
        // Refresh the course list
        fetchData();
      }, 1500);
      
    } catch (error) {
      console.error('Enrollment error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to enroll in course';
      setError(errorMessage);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      fetchData();
      return;
    }
    
    const filtered = availableCourses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setAvailableCourses(filtered);
  };

  if (loading) return <div className="loading">Loading courses...</div>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>Course Enrollment</h2>
          <p className="text-muted">Browse and enroll in available courses</p>
        </Col>
      </Row>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Enrolled Courses Section */}
      <Card className="mb-4">
        <Card.Header>
          <h5>My Enrolled Courses ({enrolledCourses.length})</h5>
        </Card.Header>
        <Card.Body>
          {enrolledCourses.length === 0 ? (
            <p className="text-center text-muted">You are not enrolled in any courses yet.</p>
          ) : (
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Credits</th>
                  <th>Instructor</th>
                  <th>Status</th>
                  <th>Enrolled Date</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map(course => (
                  <tr key={course.id}>
                    <td><Badge bg="primary">{course.code}</Badge></td>
                    <td>{course.title}</td>
                    <td>{course.credits}</td>
                    <td>{course.instructor}</td>
                    <td>
                      <Badge bg={course.registrationStatus === 'ENROLLED' ? 'success' : 'secondary'}>
                        {course.registrationStatus}
                      </Badge>
                    </td>
                    <td>{new Date(course.registrationDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Available Courses Section */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="Search available courses by title, code, or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" onClick={handleSearch}>
                Search
              </Button>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" onClick={fetchData}>
                Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5>Available Courses ({availableCourses.length})</h5>
        </Card.Header>
        <Card.Body>
          {availableCourses.length === 0 ? (
            <p className="text-center text-muted">No available courses found.</p>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Credits</th>
                  <th>Instructor</th>
                  <th>Max Students</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableCourses.map(course => (
                  <tr key={course.id}>
                    <td><Badge bg="secondary">{course.code}</Badge></td>
                    <td>{course.title}</td>
                    <td>{course.credits}</td>
                    <td>{course.instructor}</td>
                    <td>{course.maxStudents || 'Unlimited'}</td>
                    <td>
                      <small className="text-muted">
                        {course.description ? 
                          (course.description.length > 50 ? 
                            course.description.substring(0, 50) + '...' : 
                            course.description
                          ) : 'No description'
                        }
                      </small>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleEnroll(course)}
                      >
                        Enroll
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Enrollment Confirmation Modal */}
      <Modal show={showEnrollModal} onHide={() => setShowEnrollModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <div>
              <h6>Course Details:</h6>
              <p><strong>Code:</strong> {selectedCourse.code}</p>
              <p><strong>Title:</strong> {selectedCourse.title}</p>
              <p><strong>Credits:</strong> {selectedCourse.credits}</p>
              <p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
              {selectedCourse.description && (
                <p><strong>Description:</strong> {selectedCourse.description}</p>
              )}
              <hr />
              <p>Are you sure you want to enroll in this course?</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmEnrollment}>
            Confirm Enrollment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentCourseEnrollment;
