import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUserGraduate } from 'react-icons/fa';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Use environment variable for API URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://preciousacademyback-production.up.railway.app';

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const grade = searchParams.get('grade') || gradeFilter;
        const url = grade
          ? `${API_URL}/api/students?grade=${grade}`
          : `${API_URL}/api/students`;
        
        const response = await fetch(url);
        const result = await response.json();
        if (response.ok) {
          setStudents(result.students);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch students: Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [searchParams, gradeFilter]);

  const handleStudentClick = (studentId) => {
    navigate(`/students/${studentId}/history`);
  };

  const handleGradeChange = (e) => {
    const newGrade = e.target.value;
    setGradeFilter(newGrade);
    setSearchParams(newGrade ? { grade: newGrade } : {});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-deep-blue dark:text-aqua text-xl animate-pulse">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  const totalStudents = students.length;
  const gradeText = gradeFilter ? `Grade ${gradeFilter}` : 'All Grades';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6">
      {/* Header */}
      <h2 className="text-4xl font-extrabold text-deep-blue dark:text-aqua text-center mb-10 animate-fade-in">
        Student Directory
      </h2>

      {/* Filter and Total */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <label className="text-deep-blue dark:text-white text-lg font-medium">
          Filter by Grade:
          <select
            value={gradeFilter}
            onChange={handleGradeChange}
            className="ml-2 p-2 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-deep-blue dark:text-white focus:outline-none focus:ring-2 focus:ring-aqua transition duration-200"
          >
            <option value="">All Grades</option>
            {[...Array(13)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Grade {i + 1}
              </option>
            ))}
          </select>
        </label>
        <p className="text-deep-blue dark:text-aqua text-lg">
          Total Students in <span className="font-semibold">{gradeText}</span>: {totalStudents}
        </p>
      </div>

      {/* Students Container */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student, index) => (
            <div
              key={student._id}
              className={`p-6 flex justify-between items-center hover:bg-aqua/10 dark:hover:bg-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 ${
                index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
              }`}
            >
              {/* Student Info with Icon */}
              <div
                className="flex-1 flex items-center gap-4 cursor-pointer"
                onClick={() => handleStudentClick(student._id)}
              >
                <FaUserGraduate className="text-aqua dark:text-teal-400 text-xl" />
                <div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 hover:text-aqua transition-colors duration-200">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Grade {student.grade}
                  </p>
                </div>
              </div>

              {/* School Code */}
              <div className="flex-1 text-right">
                <span className="inline-block bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-200 text-sm font-semibold px-3 py-1 rounded-full">
                  {student.schoolCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-10 text-center text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in">
        Our students are the heart of Precious Academy, each bringing unique talents and aspirations to our vibrant community.
      </p>
    </div>
  );
};

export default StudentsPage;