import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col, Badge, Alert, Modal } from 'react-bootstrap';
import { courseAPI, tokenService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import StudentCourseEnrollment from './StudentCourseEnrollment';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [updateData, setUpdateData] = useState({
    title: '',
    code: '',
    description: '',
    credits: '',
    instructor: '',
    maxStudents: ''
  });
  const navigate = useNavigate();
  const user = tokenService.getUser();
  
  // Role-based access control
  const userRole = user?.role;
  const canManageCourses = userRole === 'ADMIN' || userRole === 'INSTRUCTOR';

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses from API...');
      const response = await courseAPI.getAll();
      console.log('API Response:', response);
      console.log('Courses data:', response.data);
      setCourses(response.data);
    } catch (error) {
      setError(`Failed to fetch courses: ${error.message}`);
      console.error('Error fetching courses:', error);
      console.error('Error details:', error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // If user is a student, show the student enrollment interface
  if (user && user.role === 'STUDENT') {
    return <StudentCourseEnrollment />;
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCourses();
      return;
    }
    
    try {
      const response = await courseAPI.search({ title: searchTerm });
      setCourses(response.data);
    } catch (error) {
      setError('Failed to search courses');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseAPI.delete(id);
        fetchCourses();
      } catch (error) {
        setError('Failed to delete course');
      }
    }
  };

  const handleUpdate = (course) => {
    setSelectedCourse(course);
    setUpdateData({
      title: course.title,
      code: course.code,
      description: course.description || '',
      credits: course.credits.toString(),
      instructor: course.instructor || '',
      maxStudents: course.maxStudents?.toString() || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (!updateData.title || !updateData.code || !updateData.credits) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const courseData = {
        ...updateData,
        credits: parseInt(updateData.credits),
        maxStudents: updateData.maxStudents ? parseInt(updateData.maxStudents) : null
      };
      await courseAPI.update(selectedCourse.id, courseData);
      setShowUpdateModal(false);
      setSelectedCourse(null);
      setError('');
      fetchCourses();
    } catch (error) {
      setError('Failed to update course: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>Course Management</h2>
        </Col>
        {canManageCourses && (
          <Col xs="auto">
            <Button variant="primary" onClick={() => navigate('/add-course')}>
              Add New Course
            </Button>
          </Col>
        )}
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="Search courses by title..."
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
              <Button variant="outline-secondary" onClick={fetchCourses}>
                Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5>All Courses ({courses.length})</h5>
        </Card.Header>
        <Card.Body>
          {courses.length === 0 ? (
            <p className="text-center">No courses found.</p>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Credits</th>
                  <th>Instructor</th>
                  <th>Max Students</th>
                  {canManageCourses && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>
                      <Badge bg="secondary">{course.code}</Badge>
                    </td>
                    <td>{course.title}</td>
                    <td>{course.credits}</td>
                    <td>{course.instructor}</td>
                    <td>{course.maxStudents || 'Unlimited'}</td>
                    {canManageCourses && (
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleUpdate(course)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateData.code}
                    onChange={(e) => setUpdateData({...updateData, code: e.target.value})}
                    placeholder="e.g., CS101"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Credits *</Form.Label>
                  <Form.Control
                    type="number"
                    value={updateData.credits}
                    onChange={(e) => setUpdateData({...updateData, credits: e.target.value})}
                    placeholder="e.g., 3"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Course Title *</Form.Label>
              <Form.Control
                type="text"
                value={updateData.title}
                onChange={(e) => setUpdateData({...updateData, title: e.target.value})}
                placeholder="e.g., Introduction to Computer Science"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updateData.description}
                onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
                placeholder="Course description..."
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Instructor</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateData.instructor}
                    onChange={(e) => setUpdateData({...updateData, instructor: e.target.value})}
                    placeholder="Instructor name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Students</Form.Label>
                  <Form.Control
                    type="number"
                    value={updateData.maxStudents}
                    onChange={(e) => setUpdateData({...updateData, maxStudents: e.target.value})}
                    placeholder="Leave empty for unlimited"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Update Course
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseList;
