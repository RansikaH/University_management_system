import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { userAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await userAPI.getAll();
      console.log('Users response:', response);
      console.log('Users data:', response.data);
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response);
      setError(`Failed to fetch users: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await userAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await userAPI.toggleStatus(userId);
      fetchUsers();
      setError('');
    } catch (err) {
      setError('Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(userId);
        fetchUsers();
        fetchStats();
        setError('');
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'INSTRUCTOR': return 'primary';
      case 'REGISTRAR': return 'warning';
      case 'STUDENT': return 'success';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>User Management</h2>
          <p className="text-muted">Manage system users and their roles</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-primary">{stats.totalUsers || 0}</h4>
              <p className="mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-danger">{stats.admins || 0}</h4>
              <p className="mb-0">Administrators</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-primary">{stats.instructors || 0}</h4>
              <p className="mb-0">Instructors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">{stats.students || 0}</h4>
              <p className="mb-0">Students</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">All Users</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={user.enabled ? 'success' : 'secondary'}>
                      {user.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant={user.enabled ? 'warning' : 'success'}
                      size="sm"
                      className="me-2"
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.firstName}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value
                  })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.lastName}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    lastName: e.target.value
                  })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    email: e.target.value
                  })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    role: e.target.value
                  })}
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="REGISTRAR">Registrar</option>
                  <option value="STUDENT">Student</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              try {
                await userAPI.update(selectedUser.id, selectedUser);
                fetchUsers();
                setShowModal(false);
                setError('');
              } catch (err) {
                setError('Failed to update user');
              }
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;
