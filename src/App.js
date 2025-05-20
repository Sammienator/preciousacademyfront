import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentsPage from './components/StudentsPage';
import AddStudentPage from './components/AddStudentPage';
import TestResultsPage from './components/TestResultsPage';
import ReportsPage from './components/ReportsPage';
import StudentHistoryPage from './components/StudentHistoryPage';
import './index.css';

const API_URL = process.env.REACT_APP_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="bg-deep-blue text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Precious Academy</h1>
      <div className="flex space-x-4">
        <button onClick={() => navigate('/dashboard')} className="hover:text-aqua transition duration-300">
          Dashboard
        </button>
        <button onClick={() => navigate('/students')} className="hover:text-aqua transition duration-300">
          Students
        </button>
        <button onClick={() => navigate('/add-student')} className="hover:text-aqua transition duration-300">
          Add Student
        </button>
        <button onClick={() => navigate('/test-results')} className="hover:text-aqua transition duration-300">
          Test Results
        </button>
        {role === 'admin' && (
          <button onClick={() => navigate('/reports')} className="hover:text-aqua transition duration-300">
            Reports
          </button>
        )}
        <button
          onClick={handleLogout}
          className="bg-aqua text-dark-black px-4 py-2 rounded-lg hover:bg-white transition duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (adminOnly && role !== 'admin') {
      navigate('/dashboard');
    }
  }, [token, role, adminOnly, navigate]);

  return token ? children : null;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-dark-black">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <>
                ۘ<Navbar />
                <div className="max-w-5xl mx-auto bg-white dark:bg-dark-black p-6 rounded-xl shadow-lg border border-aqua mt-6">
                  <Routes>
                    <Route
                      path="/dashboard"
                      element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                    />
                    <Route
                      path="/students"
                      element={<ProtectedRoute><StudentsPage /></ProtectedRoute>}
                    />
                    <Route
                      path="/students/:id/history"
                      element={<ProtectedRoute><StudentHistoryPage /></ProtectedRoute>}
                    />
                    <Route
                      path="/add-student"
                      element={<ProtectedRoute><AddStudentPage /></ProtectedRoute>}
                    />
                    <Route
                      path="/test-results"
                      element={<ProtectedRoute><TestResultsPage apiUrl={API_URL} /></ProtectedRoute>}
                    />
                    <Route
                      path="/reports"
                      element={<ProtectedRoute adminOnly><ReportsPage /></ProtectedRoute>}
                    />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;