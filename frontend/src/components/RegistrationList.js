import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col, Badge, Alert, Modal } from 'react-bootstrap';
import { registrationAPI, studentAPI, courseAPI } from '../services/api';

const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [newRegistration, setNewRegistration] = useState({ studentId: '', courseId: '' });
  const [updateData, setUpdateData] = useState({ status: '', grade: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regRes, studRes, courseRes] = await Promise.all([
        registrationAPI.getAll(),
        studentAPI.getAll(),
        courseAPI.getAll()
      ]);
      
      setRegistrations(regRes.data);
      setStudents(studRes.data);
      setCourses(courseRes.data);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRegistration = async () => {
    if (!newRegistration.studentId || !newRegistration.courseId) {
      setError('Please select both student and course');
      return;
    }
    
    try {
      const registrationData = {
        studentId: parseInt(newRegistration.studentId),
        courseId: parseInt(newRegistration.courseId)
      };
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

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getCourseInfo = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.code} - ${course.title}` : 'Unknown';
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
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            New Registration
          </Button>
        </Col>
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
                  <th>Grade</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map(registration => (
                  <tr key={registration.id}>
                    <td>{getStudentName(registration.student?.id)}</td>
                    <td>{getCourseInfo(registration.course?.id)}</td>
                    <td>{getStatusBadge(registration.status)}</td>
                    <td>{registration.grade || '-'}</td>
                    <td>{new Date(registration.registrationDate).toLocaleDateString()}</td>
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
