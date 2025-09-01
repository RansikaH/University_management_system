import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { courseAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    credits: '',
    instructor: '',
    maxStudents: ''
  });
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
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim() || !formData.code.trim() || !formData.credits) {
      setError('Please fill in all required fields (Title, Code, Credits)');
      return;
    }

    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : null
      };

      console.log('Creating course with data:', courseData);
      const response = await courseAPI.create(courseData);
      console.log('Course creation response:', response);
      setSuccess('Course created successfully!');
      setTimeout(() => navigate('/courses'), 2000);
    } catch (error) {
      console.error('Course creation error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create course';
      setError(`Failed to create course: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h2>Add New Course</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card>
        <Card.Header>
          <h5>Course Information</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Course Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter course title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Code *</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="e.g., CS101"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Course description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Credits *</Form.Label>
              <Form.Control
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                required
                min="1"
                max="6"
                placeholder="Number of credits"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructor</Form.Label>
              <Form.Control
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="Instructor name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Maximum Students</Form.Label>
              <Form.Control
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                min="1"
                placeholder="Leave empty for unlimited"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Create Course
              </Button>
              <Button variant="secondary" onClick={() => navigate('/courses')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddCourse;
