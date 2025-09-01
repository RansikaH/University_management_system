import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ConnectionTest from './components/ConnectionTest';
import NavigationBar from './components/NavigationBar';
import CourseList from './components/CourseList';
import StudentList from './components/StudentList';
import RegistrationList from './components/RegistrationList';
import AddCourse from './components/AddCourse';
import AddStudent from './components/AddStudent';
import Dashboard from './components/Dashboard';
import ResultsList from './components/ResultsList';
import StudentTranscript from './components/StudentTranscript';
import CourseResults from './components/CourseResults';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test-connection" element={<ConnectionTest />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/students" element={<StudentList key={Date.now()} />} />
            <Route path="/registrations" element={<RegistrationList />} />
            <Route path="/results" element={<ResultsList />} />
            <Route path="/transcript" element={<StudentTranscript />} />
            <Route path="/course-results" element={<CourseResults />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/add-student" element={<AddStudent />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
