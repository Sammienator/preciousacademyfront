import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const TestResultsPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchTestResults = async () => {
      setLoading(true);
      try {
        const grade = searchParams.get('grade') || gradeFilter;
        const term = searchParams.get('term') || termFilter;
        let url = 'http://localhost:5000/api/test-results';
        const params = new URLSearchParams();
        if (grade) params.append('grade', grade);
        if (term) params.append('term', term);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        const result = await response.json();
        if (response.ok) {
          setTestResults(result.testResults || []);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to fetch test results');
      } finally {
        setLoading(false);
      }
    };
    fetchTestResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleGradeChange = (e) => {
    const newGrade = e.target.value;
    setGradeFilter(newGrade);
    setSearchParams({ ...(termFilter && { term: termFilter }), ...(newGrade && { grade: newGrade }) });
  };

  const handleTermChange = (e) => {
    const newTerm = e.target.value;
    setTermFilter(newTerm);
    setSearchParams({ ...(gradeFilter && { grade: gradeFilter }), ...(newTerm && { term: newTerm }) });
  };

  // Calculate per-student averages and sort
  const calculateStudentAverages = () => {
    const studentMap = testResults.reduce((acc, test) => {
      const studentId = test.studentId._id;
      if (!acc[studentId]) {
        acc[studentId] = {
          name: test.studentId.name,
          subjects: [],
        };
      }
      acc[studentId].subjects.push(test.subjects);
      return acc;
    }, {});

    const students = Object.values(studentMap).map((student) => {
      const subjectScores = student.subjects.flatMap((s) =>
        [s.maths, s.english, s.science, s.history, s.geography].filter((score) => score !== undefined)
      );
      const average = subjectScores.length
        ? (subjectScores.reduce((sum, score) => sum + score, 0) / subjectScores.length).toFixed(2)
        : 'N/A';
      return { ...student, average: parseFloat(average) || 'N/A' };
    });

    return students.sort((a, b) => {
      if (a.average === 'N/A') return 1;
      if (b.average === 'N/A') return -1;
      return b.average - a.average;
    });
  };

  const studentsWithAverages = calculateStudentAverages();

  // Determine color based on average
  const getAverageColor = (average) => {
    if (average === 'N/A') return 'text-gray-400';
    if (average >= 85) return 'text-green-400';
    if (average >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-white text-xl animate-pulse">Loading test results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-400 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6 font-custom">
      <h2 className="text-4xl font-extrabold text-white text-center mb-10">
        Test Results
      </h2>

      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <label className="text-white text-lg font-medium">Filter by Grade:</label>
            <select
              value={gradeFilter}
              onChange={handleGradeChange}
              className="ml-2 p-3 w-48 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="">All Grades</option>
              {[...Array(13)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Grade {i + 1}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-12 pointer-events-none text-aqua">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <label className="text-white text-lg font-medium">Filter by Term:</label>
            <select
              value={termFilter}
              onChange={handleTermChange}
              className="ml-2 p-3 w-48 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua transition-all duration-300 appearance-none cursor-pointer"
            >
              <option value="">All Terms</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
            <div className="absolute right-4 top-12 pointer-events-none text-aqua">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-white text-lg">
          Total Students: <span className="font-semibold">{studentsWithAverages.length}</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {studentsWithAverages.length === 0 ? (
          <p className="text-white text-center">No test results available for this selection.</p>
        ) : (
          <table className="grok.average w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl text-white">
            <thead>
              <tr className="bg-deep-blue font-semibold">
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Avg</th>
                <th className="p-3 text-left">Maths</th>
                <th className="p-3 text-left">English</th>
                <th className="p-3 text-left">Science</th>
                <th className="p-3 text-left">History</th>
                <th className="p-3 text-left">Geography</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {studentsWithAverages.map((student, index) => {
                const latestSubjects = student.subjects[student.subjects.length - 1];
                return (
                  <tr key={student.name}>
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{student.name}</td>
                    <td className={`p-3 font-bold ${getAverageColor(student.average)}`}>
                      {student.average}
                    </td>
                    <td className="p-3">{latestSubjects.maths}</td>
                    <td className="p-3">{latestSubjects.english}</td>
                    <td className="p-3">{latestSubjects.science}</td>
                    <td className="p-3">{latestSubjects.history}</td>
                    <td className="p-3">{latestSubjects.geography}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TestResultsPage;