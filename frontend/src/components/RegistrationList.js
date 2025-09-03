import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col, Badge, Alert, Modal } from 'react-bootstrap';
import { registrationAPI, studentAPI, courseAPI, authAPI, tokenService } from '../services/api';

const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [newRegistration, setNewRegistration] = useState({ studentId: '', courseId: '' });
  const [updateData, setUpdateData] = useState({ status: '', grade: '' });

  // Get current user role for access control
  const user = tokenService.getUser();
  const userRole = user?.role;
  const canManageRegistrations = userRole === 'ADMIN' || userRole === 'REGISTRAR';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current user first
      const userRes = await authAPI.getCurrentUser();
      setCurrentUser(userRes.data);
      
      // If user is a student, get their specific data
      if (userRes.data.role === 'STUDENT') {
        const [regRes, courseRes] = await Promise.all([
          registrationAPI.getMyRegistrations(),
          courseAPI.getAll()
        ]);
        
        setRegistrations(regRes.data);
        setCourses(courseRes.data);
        
        // Try to get current user's student data
        try {
          const studentRes = await authAPI.getCurrentUserStudent();
          setCurrentStudent(studentRes.data);
        } catch (err) {
          console.log('No student data found for user');
        }
      } else {
        // For admin/instructor/registrar, get all data
        const [regRes, studRes, courseRes] = await Promise.all([
          registrationAPI.getAll(),
          studentAPI.getAll(),
          courseAPI.getAll()
        ]);
        
        setRegistrations(regRes.data);
        setStudents(studRes.data);
        setCourses(courseRes.data);
      }
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRegistration = async () => {
    if (!newRegistration.courseId) {
      setError('Please select a course');
      return;
    }
    
    try {
      const registrationData = {
        studentId: currentUser.role === 'STUDENT' ? currentStudent?.id : parseInt(newRegistration.studentId),
        courseId: parseInt(newRegistration.courseId)
      };
      
      if (!registrationData.studentId) {
        setError('Student information not found');
        return;
      }
      
      await registrationAPI.create(registrationData);
      setShowModal(false);
      setNewRegistration({ studentId: '', courseId: '' });
      setError('');
      fetchData();
    } catch (error) {
      setError('Failed to create registration: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await registrationAPI.delete(id);
        fetchData();
      } catch (error) {
        setError('Failed to delete registration');
      }
    }
  };

  const handleUpdate = (registration) => {
    setSelectedRegistration(registration);
    setUpdateData({
      status: registration.status || 'ENROLLED',
      grade: registration.grade || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await registrationAPI.update(selectedRegistration.id, updateData);
      setShowUpdateModal(false);
      setSelectedRegistration(null);
      setError('');
      fetchData();
    } catch (error) {
      setError('Failed to update registration: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStudentName = (student) => {
    if (!student) return 'Unknown';
    
    // If student object has firstName and lastName directly
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }
    
    // If student has a user object with name properties
    if (student.user) {
      return `${student.user.firstName} ${student.user.lastName}`;
    }
    
    // Fallback to student ID if name not found
    return student.studentId || 'Unknown';
  };

  const getCourseInfo = (course) => {
    if (!course) return 'Unknown';
    
    // If course has both code and title
    if (course.code && course.title) {
      return `${course.code} - ${course.title}`;
    }
    
    // If we only have a course ID, try to find it in the courses list
    if (typeof course === 'number' || (typeof course === 'string' && course.match(/^\d+$/))) {
      const foundCourse = courses.find(c => c.id === parseInt(course));
      if (foundCourse) {
        return foundCourse.code && foundCourse.title 
          ? `${foundCourse.code} - ${foundCourse.title}` 
          : `Course ID: ${course}`;
      }
    }
    
    // Fallback to course ID or 'Unknown'
    return course.id ? `Course ID: ${course.id}` : 'Unknown';
  };

  const getStatusBadge = (status) => {
    const variants = {
      ENROLLED: 'primary',
      COMPLETED: 'success',
      DROPPED: 'danger',
      PENDING: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) return <div className="loading">Loading registrations...</div>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>Registration Management</h2>
        </Col>
        {canManageRegistrations && (
          <Col xs="auto">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              New Registration
            </Button>
          </Col>
        )}
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header>
          <h5>All Registrations ({registrations.length})</h5>
        </Card.Header>
        <Card.Body>
          {registrations.length === 0 ? (
            <p className="text-center">No registrations found.</p>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                  {canManageRegistrations && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {registrations.map(registration => (
                  <tr key={registration.id}>
                    <td>{getStudentName(registration.student)}</td>
                    <td>{getCourseInfo(registration.course)}</td>
                    <td>{getStatusBadge(registration.status)}</td>
                    <td>{new Date(registration.registrationDate).toLocaleDateString()}</td>
                    {canManageRegistrations && (
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleUpdate(registration)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(registration.id)}
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {currentUser?.role !== 'STUDENT' && (
              <Form.Group className="mb-3">
                <Form.Label>Student</Form.Label>
                <Form.Select
                  value={newRegistration.studentId}
                  onChange={(e) => setNewRegistration({...newRegistration, studentId: e.target.value})}
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.studentId} - {student.firstName} {student.lastName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Select
                value={newRegistration.courseId}
                onChange={(e) => setNewRegistration({...newRegistration, courseId: e.target.value})}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateRegistration}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={updateData.status}
                onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
              >
                <option value="ENROLLED">Enrolled</option>
                <option value="COMPLETED">Completed</option>
                <option value="DROPPED">Dropped</option>
                <option value="PENDING">Pending</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Grade</Form.Label>
              <Form.Control
                type="text"
                value={updateData.grade}
                onChange={(e) => setUpdateData({...updateData, grade: e.target.value})}
                placeholder="e.g., A+, B, C+"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Update Registration
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegistrationList;
