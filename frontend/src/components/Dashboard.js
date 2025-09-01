import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { courseAPI, studentAPI, registrationAPI, resultAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRegistrations: 0,
    availableCourses: 0,
    totalResults: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <Row>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                <Badge bg="primary" className="fs-4">{stats.totalCourses}</Badge>
              </Card.Title>
              <Card.Text>Total Courses</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                <Badge bg="success" className="fs-4">{stats.totalStudents}</Badge>
              </Card.Title>
              <Card.Text>Total Students</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                <Badge bg="info" className="fs-4">{stats.totalRegistrations}</Badge>
              </Card.Title>
              <Card.Text>Total Registrations</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                <Badge bg="warning" className="fs-4">{stats.availableCourses}</Badge>
              </Card.Title>
              <Card.Text>Available Courses</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>
                <Badge bg="dark" className="fs-4">{stats.totalResults}</Badge>
              </Card.Title>
              <Card.Text>Total Results</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Welcome to University Course Management System</h5>
            </Card.Header>
            <Card.Body>
              <p>This modern enterprise application helps manage university courses, students, and registrations.</p>
              <ul>
                <li><strong>Courses:</strong> View, add, edit, and delete course offerings</li>
                <li><strong>Students:</strong> Manage student information and profiles</li>
                <li><strong>Registrations:</strong> Handle course enrollments and track student progress</li>
                <li><strong>Results:</strong> Record and manage student grades and exam scores</li>
                <li><strong>Transcript:</strong> View individual student academic transcripts with GPA</li>
                <li><strong>Course Analysis:</strong> Analyze course performance and grade distribution</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
