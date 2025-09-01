import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { resultAPI, studentAPI } from '../services/api';

const StudentTranscript = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      setError('Failed to fetch students');
    }
  };

  const fetchTranscript = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      const [resultsRes, gpaRes, avgRes] = await Promise.all([
        resultAPI.getByStudent(selectedStudent),
        resultAPI.getStudentGPA(selectedStudent),
        resultAPI.getStudentAverage(selectedStudent)
      ]);

      const student = students.find(s => s.id === parseInt(selectedStudent));
      
      setTranscript({
        student: student,
        results: resultsRes.data,
        gpa: gpaRes.data,
        average: avgRes.data
      });
    } catch (error) {
      setError('Failed to fetch transcript');
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
      <h2>Student Transcript</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>Select Student</Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form.Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.studentId} - {student.firstName} {student.lastName}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Button 
                variant="primary" 
                onClick={fetchTranscript}
                disabled={!selectedStudent || loading}
              >
                {loading ? 'Loading...' : 'View Transcript'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {transcript && (
        <>
          <Card className="mb-4">
            <Card.Header>
              <h5>Student Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Student ID:</strong> {transcript.student.studentId}</p>
                  <p><strong>Name:</strong> {transcript.student.firstName} {transcript.student.lastName}</p>
                  <p><strong>Email:</strong> {transcript.student.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Overall GPA:</strong> 
                    <Badge bg="info" className="ms-2">
                      {transcript.gpa ? transcript.gpa.toFixed(2) : '0.00'}
                    </Badge>
                  </p>
                  <p><strong>Overall Average:</strong> 
                    <Badge bg="success" className="ms-2">
                      {transcript.average ? transcript.average.toFixed(1) : '0.0'}%
                    </Badge>
                  </p>
                  <p><strong>Total Courses:</strong> {transcript.results.length}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5>Academic Results</h5>
            </Card.Header>
            <Card.Body>
              {transcript.results.length === 0 ? (
                <p className="text-center">No results found for this student.</p>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Exam Type</th>
                      <th>Date</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcript.results.map(result => (
                      <tr key={result.id}>
                        <td>
                          <Badge bg="secondary">{result.course?.code}</Badge>
                        </td>
                        <td>{result.course?.title}</td>
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

export default StudentTranscript;
