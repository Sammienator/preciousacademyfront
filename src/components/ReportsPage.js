import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const ReportsPage = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [reportType, setReportType] = useState('scores');
  const [searchParams, setSearchParams] = useSearchParams();

  const API_URL = (process.env.REACT_APP_API_URL || 'https://preciousacademyback-production.up.railway.app')
    .replace(/\/+$/, '')
    .replace(/^\/+/, '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const term = searchParams.get('term') || termFilter;
        let url = `${API_URL}/api/reports/grade-summary?type=${reportType}`;
        if (term) url += `&term=${term}`;
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch summary');
        const result = await response.json();
        setSummary(result.summary || []);
      } catch (err) {
        setError('Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [searchParams, termFilter, reportType]);

  const handleTermChange = (term) => {
    setTermFilter(term);
    setSearchParams({ ...(term && { term }), type: reportType });
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    setSearchParams({ ...(termFilter && { term: termFilter }), type });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-white text-xl animate-pulse">Loading reports...</p>
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
        Grade Reports
      </h2>

      <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="text-white text-lg font-medium">Filter by Term:</label>
            <div className="flex gap-2 mt-2">
              {['Term 1', 'Term 2', 'Term 3'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleTermChange(term)}
                  className={`px-4 py-2 rounded-lg ${
                    termFilter === term ? 'bg-aqua text-dark-black' : 'bg-deep-blue text-white'
                  } hover:bg-aqua hover:text-dark-black transition duration-300`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-white text-lg font-medium">Report Type:</label>
            <div className="flex gap-2 mt-2">
              {['scores', 'fees'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleReportTypeChange(type)}
                  className={`px-4 py-2 rounded-lg ${
                    reportType === type ? 'bg-aqua text-dark-black' : 'bg-deep-blue text-white'
                  } hover:bg-aqua hover:text-dark-black transition duration-300`}
                >
                  {type === 'scores' ? 'Test Scores' : 'Fees'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-white text-lg">
          Total Grades: <span className="font-semibold">{summary.length}</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {summary.length === 0 ? (
          <p className="text-white text-center">No data available for this selection.</p>
        ) : (
          <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl text-white">
            <thead>
              <tr className="bg-deep-blue font-semibold">
                <th className="p-3 text-left">Grade</th>
                {reportType === 'scores' ? (
                  <th className="p-3 text-left">Avg Grade Score</th>
                ) : (
                  <>
                    <th className="p-3 text-left">Paid Fees</th>
                    <th className="p-3 text-left">Partial Fees</th>
                    <th className="p-3 text-left">Unpaid Fees</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {summary.map((gradeData, index) =>
                gradeData ? (
                  <tr key={gradeData.grade || index}>
                    <td className="p-3 whitespace-nowrap">{gradeData.grade || 'N/A'}</td>
                    {reportType === 'scores' ? (
                      <td className="p-3 whitespace-nowrap">{gradeData.avgGrade || 'N/A'}</td>
                    ) : (
                      <>
                        <td className="p-3 whitespace-nowrap">{gradeData.feeStatus?.paid || 0}</td>
                        <td className="p-3 whitespace-nowrap">{gradeData.feeStatus?.partial || 0}</td>
                        <td className="p-3 whitespace-nowrap">{gradeData.feeStatus?.unpaid || 0}</td>
                      </>
                    )}
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;