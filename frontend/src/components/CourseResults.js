import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { resultAPI, courseAPI } from '../services/api';

const CourseResults = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseStats, setCourseStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      setError('Failed to fetch courses');
    }
  };

  const fetchCourseResults = async () => {
    if (!selectedCourse) return;
    
    setLoading(true);
    try {
      const [resultsRes, avgRes] = await Promise.all([
        resultAPI.getByCourse(selectedCourse),
        resultAPI.getCourseAverage(selectedCourse)
      ]);

      const course = courses.find(c => c.id === parseInt(selectedCourse));
      const courseResults = resultsRes.data;
      
      // Calculate grade distribution
      const gradeDistribution = courseResults.reduce((acc, result) => {
        acc[result.grade] = (acc[result.grade] || 0) + 1;
        return acc;
      }, {});

      setCourseStats({
        course: course,
        average: avgRes.data,
        totalStudents: courseResults.length,
        gradeDistribution: gradeDistribution
      });
      setResults(courseResults);
    } catch (error) {
      setError('Failed to fetch course results');
    } finally {
      setLoading(false);
    }
  };

  const getGradeBadge = (grade) => {
    // Convert backend enum to display format
    const gradeMap = {
      'A_PLUS': 'A+', 'A': 'A', 'A_MINUS': 'A-',
      'B_PLUS': 'B+', 'B': 'B', 'B_MINUS': 'B-',
      'C_PLUS': 'C+', 'C': 'C', 'C_MINUS': 'C-',
      'D_PLUS': 'D+', 'D': 'D', 'F': 'F'
    };
    
    const displayGrade = gradeMap[grade] || grade;
    
    const variants = {
      'A+': 'success', 'A': 'success', 'A-': 'success',
      'B+': 'primary', 'B': 'primary', 'B-': 'primary',
      'C+': 'warning', 'C': 'warning', 'C-': 'warning',
      'D+': 'danger', 'D': 'danger', 'F': 'danger'
    };
    
    return <Badge bg={variants[displayGrade] || 'secondary'}>{displayGrade}</Badge>;
  };

  return (
    <div>
      <h2>Course Results Analysis</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>Select Course</Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Button 
                variant="primary" 
                onClick={fetchCourseResults}
                disabled={!selectedCourse || loading}
              >
                {loading ? 'Loading...' : 'View Results'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {courseStats && (
        <>
          <Row className="mb-4">
            <Col md={6}>
              <Card>
                <Card.Header>Course Information</Card.Header>
                <Card.Body>
                  <p><strong>Course:</strong> {courseStats.course.code} - {courseStats.course.title}</p>
                  <p><strong>Instructor:</strong> {courseStats.course.instructor}</p>
                  <p><strong>Credits:</strong> {courseStats.course.credits}</p>
                  <p><strong>Students with Results:</strong> {courseStats.totalStudents}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Header>Course Statistics</Card.Header>
                <Card.Body>
                  <p><strong>Class Average:</strong> 
                    <Badge bg="info" className="ms-2">
                      {courseStats.average ? courseStats.average.toFixed(1) : '0.0'}%
                    </Badge>
                  </p>
                  <p><strong>Grade Distribution:</strong></p>
                  <div className="d-flex flex-wrap gap-2">
                    {Object.entries(courseStats.gradeDistribution).map(([grade, count]) => (
                      <Badge key={grade} bg="secondary">
                        {grade}: {count}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <h5>Student Results</h5>
            </Card.Header>
            <Card.Body>
              {results.length === 0 ? (
                <p className="text-center">No results found for this course.</p>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Exam Type</th>
                      <th>Date</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(result => (
                      <tr key={result.id}>
                        <td>
                          <Badge bg="info">{result.student?.studentId}</Badge>
                        </td>
                        <td>{result.student?.firstName} {result.student?.lastName}</td>
                        <td>
                          <Badge bg={result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'danger'}>
                            {result.score}%
                          </Badge>
                        </td>
                        <td>{getGradeBadge(result.grade)}</td>
                        <td>{result.examType}</td>
                        <td>{new Date(result.examDate).toLocaleDateString()}</td>
                        <td>{result.remarks || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default CourseResults;
