import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUserGraduate } from 'react-icons/fa';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const API_URL = process.env.REACT_APP_API_URL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchStudents = async () => {
      if (!gradeFilter) return;
      setLoading(true);
      try {
        const url = `${API_URL}/api/students?grade=${gradeFilter}`;
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
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
  }, [gradeFilter]);

  const handleStudentClick = (studentId) => {
    navigate(`/students/${studentId}/history`);
  };

  const handleGradeChange = (grade) => {
    setGradeFilter(grade);
    setSearchParams(grade ? { grade } : {});
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_URL}/api/students/${studentId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          setStudents(students.filter((student) => student._id !== studentId));
        } else {
          const result = await response.json();
          alert(result.message);
        }
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  const totalStudents = students.length;

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6">
      <h2 className="text-4xl font-extrabold text-deep-blue dark:text-aqua text-center mb-10 animate-fade-in">
        Student Directory
      </h2>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {[...Array(13)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handleGradeChange(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                gradeFilter === (i + 1).toString()
                  ? 'bg-aqua text-dark-black'
                  : 'bg-deep-blue text-white'
              } hover:bg-aqua hover:text-dark-black transition duration-300`}
            >
              Grade {i + 1}
            </button>
          ))}
        </div>
        {gradeFilter && (
          <p className="text-deep-blue dark:text-aqua text-lg text-center mt-4">
            Total Students in Grade {gradeFilter}: {totalStudents}
          </p>
        )}
      </div>

      {gradeFilter ? (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {students.map((student, index) => (
              <div
                key={student._id}
                className={`p-6 flex justify-between items-center hover:bg-aqua/10 dark:hover:bg-gray-700 transition duration-300 ${
                  index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                }`}
              >
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
                <div className="flex-1 text-right flex items-center justify-end gap-4">
                  <span className="inline-block bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-200 text-sm font-semibold px-3 py-1 rounded-full">
                    {student.schoolCode}
                  </span>
                  {localStorage.getItem('role') === 'admin' && (
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          Please select a grade to view students.
        </p>
      )}

      <p className="mt-10 text-center text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in">
        Our students are the heart of Precious Academy, each bringing unique talents and aspirations to our vibrant community.
      </p>
    </div>
  );
};

export default StudentsPage;