import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import Login from './components/Login';
import Register from './components/Register';
import StudentRegister from './components/StudentRegister';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './components/UserManagement';
import { tokenService } from './services/api';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = tokenService.getToken();
    const userData = tokenService.getUser();
    
    if (token && userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    tokenService.clearAuth();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <NavigationBar onLogout={handleLogout} />
      <Container className="mt-4">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" replace /> : <Register />
          } />
          <Route path="/register/student" element={
            user ? <Navigate to="/dashboard" replace /> : <StudentRegister />
          } />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/test-connection" element={
            <ProtectedRoute>
              <ConnectionTest />
            </ProtectedRoute>
          } />
          
          <Route path="/courses" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'INSTRUCTOR', 'STUDENT', 'REGISTRAR']}>
              <CourseList />
            </ProtectedRoute>
          } />
          
          <Route path="/students" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'INSTRUCTOR', 'REGISTRAR']}>
              <StudentList key={Date.now()} />
            </ProtectedRoute>
          } />
          
          <Route path="/registrations" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'INSTRUCTOR', 'REGISTRAR', 'STUDENT']}>
              <RegistrationList />
            </ProtectedRoute>
          } />
          
          <Route path="/results" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'INSTRUCTOR', 'STUDENT']}>
              <ResultsList />
            </ProtectedRoute>
          } />
          
          <Route path="/transcript" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'INSTRUCTOR', 'STUDENT']}>
              <StudentTranscript />
            </ProtectedRoute>
          } />
          
          <Route path="/course-results" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'INSTRUCTOR']}>
              <CourseResults />
            </ProtectedRoute>
          } />
          
          <Route path="/add-course" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'INSTRUCTOR']}>
              <AddCourse />
            </ProtectedRoute>
          } />
          
          <Route path="/add-student" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'REGISTRAR']}>
              <AddStudent />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
