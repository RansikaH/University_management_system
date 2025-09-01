import React, { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const ConnectionTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('');

    try {
      console.log('Testing direct connection to backend...');
      
      // Test 1: Check data count
      const countResponse = await axios.get('http://localhost:8080/api/test/data-count', {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });
      
      console.log('Data count test:', countResponse.data);
      
      // Test 2: Get actual courses
      const coursesResponse = await axios.get('http://localhost:8080/api/courses', {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });
      
      console.log('Courses test:', coursesResponse.data);
      
      setTestResult(`✅ SUCCESS: Backend connected! 
      Data counts: ${countResponse.data.courses} courses, ${countResponse.data.students} students, ${countResponse.data.registrations} registrations, ${countResponse.data.results} results.
      Courses API returned ${coursesResponse.data.length} courses.`);
      
    } catch (error) {
      console.error('Connection test failed:', error);
      
      if (error.code === 'ECONNREFUSED') {
        setTestResult('❌ ERROR: Backend server is not running on port 8080');
      } else if (error.code === 'ERR_NETWORK') {
        setTestResult('❌ ERROR: Network error - check if backend is accessible');
      } else if (error.response?.status === 404) {
        setTestResult('❌ ERROR: API endpoint not found - check backend routes');
      } else if (error.response?.status === 403) {
        setTestResult('❌ ERROR: CORS issue - backend rejecting frontend requests');
      } else {
        setTestResult(`❌ ERROR: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-3">
      <Card.Header>
        <h5>Backend Connection Test</h5>
      </Card.Header>
      <Card.Body>
        <Button 
          variant="primary" 
          onClick={testConnection} 
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </Button>
        
        {testResult && (
          <Alert 
            variant={testResult.includes('SUCCESS') ? 'success' : 'danger'} 
            className="mt-3"
          >
            {testResult}
          </Alert>
        )}
        
        <div className="mt-3">
          <small className="text-muted">
            This will test direct connection to: http://localhost:8080/api/courses
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ConnectionTest;
