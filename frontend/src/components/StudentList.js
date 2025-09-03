import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col, Badge, Alert, Modal } from 'react-bootstrap';
import { studentAPI, tokenService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updateData, setUpdateData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });
  const navigate = useNavigate();
  
  // Get current user role
  const currentUser = tokenService.getUser();
  const userRole = currentUser?.role;
  const isInstructor = userRole === 'INSTRUCTOR';
  const canManageStudents = userRole === 'ADMIN' || userRole === 'REGISTRAR';

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add effect to refresh when component becomes visible
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing student data...');
      fetchStudents();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchStudents = async () => {
    try {
      console.log('Fetching students from API...');
      const response = await studentAPI.getAll();
      console.log('Students API Response:', response);
      console.log('Students data:', response.data);
      setStudents(response.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      setError(`Failed to fetch students: ${error.message}`);
      console.error('Error fetching students:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchStudents();
      return;
    }
    
    try {
      const response = await studentAPI.search(searchTerm);
      setStudents(response.data);
    } catch (error) {
      setError('Failed to search students');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        fetchStudents();
      } catch (error) {
        setError('Failed to delete student');
      }
    }
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student);
    setUpdateData({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || '',
      dateOfBirth: student.dateOfBirth || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (!updateData.studentId || !updateData.firstName || !updateData.lastName || !updateData.email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await studentAPI.update(selectedStudent.id, updateData);
      setShowUpdateModal(false);
      setSelectedStudent(null);
      setError('');
      fetchStudents();
    } catch (error) {
      setError('Failed to update student: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>Student Management</h2>
        </Col>
        {canManageStudents && (
          <Col xs="auto">
            <Button variant="primary" onClick={() => navigate('/add-student')}>
              Add New Student
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
                placeholder="Search students by name..."
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
              <Button variant="outline-secondary" onClick={fetchStudents}>
                Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5>All Students ({students.length})</h5>
        </Card.Header>
        <Card.Body>
          {students.length === 0 ? (
            <p className="text-center">No students found.</p>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date of Birth</th>
                  {canManageStudents && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>
                      <Badge bg="info">{student.studentId}</Badge>
                    </td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.dateOfBirth}</td>
                    {canManageStudents && (
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleUpdate(student)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
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
          <Modal.Title>Update Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student ID *</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateData.studentId}
                    onChange={(e) => setUpdateData({...updateData, studentId: e.target.value})}
                    placeholder="e.g., S001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={updateData.email}
                    onChange={(e) => setUpdateData({...updateData, email: e.target.value})}
                    placeholder="student@example.com"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateData.firstName}
                    onChange={(e) => setUpdateData({...updateData, firstName: e.target.value})}
                    placeholder="First name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateData.lastName}
                    onChange={(e) => setUpdateData({...updateData, lastName: e.target.value})}
                    placeholder="Last name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={updateData.phone}
                    onChange={(e) => setUpdateData({...updateData, phone: e.target.value})}
                    placeholder="Phone number"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={updateData.dateOfBirth}
                    onChange={(e) => setUpdateData({...updateData, dateOfBirth: e.target.value})}
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
            Update Student
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentList;
