import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import StudentsPage from './components/StudentsPage';
import AddStudentPage from './components/AddStudentPage';
import TestResultsPage from './components/TestResultsPage';
import ReportsPage from './components/ReportsPage';
import StudentHistoryPage from './components/StudentHistoryPage';
import './index.css';

// Backend API URL from environment variable
const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://preciousacademyback-production.up.railway.app/' // Replace with your actual backend URL
  : 'http://localhost:5000';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-deep-blue text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Precious Academy</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="hover:text-aqua transition duration-300"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/students')}
          className="hover:text-aqua transition duration-300"
        >
          Students
        </button>
        <button
          onClick={() => navigate('/add-student')}
          className="hover:text-aqua transition duration-300"
        >
          Add Student
        </button>
        <button
          onClick={() => navigate('/test-results')}
          className="hover:text-aqua transition duration-300"
        >
          Test Results
        </button>
        <button
          onClick={() => navigate('/reports')}
          className="hover:text-aqua transition duration-300"
        >
          Reports
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-aqua text-dark-black px-4 py-2 rounded-lg hover:bg-white transition duration-300"
        >
          Exit
        </button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-dark-black">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <div className="max-w-5xl mx-auto bg-white dark:bg-dark-black p-6 rounded-xl shadow-lg border border-aqua mt-6">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/students" element={<StudentsPage />} />
                    <Route path="/students/:id/history" element={<StudentHistoryPage />} />
                    <Route path="/add-student" element={<AddStudentPage />} />
                    <Route path="/test-results" element={<TestResultsPage apiUrl={API_URL} />} />
                    <Route path="/reports" element={<ReportsPage />} />
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