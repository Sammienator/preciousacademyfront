import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const ReportsPage = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [termFilter, setTermFilter] = useState('');
  const [reportType, setReportType] = useState('scores');
  const [searchParams, setSearchParams] = useSearchParams();

  const API_URL = process.env.REACT_APP_API_URL || 'https://preciousacademyback-production.up.railway.app';

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const term = searchParams.get('term') || termFilter;
        let url = `${API_URL}/api/reports/grade-summary?type=${reportType}`;
        if (term) url += `&term=${term}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch summary');
        const result = await response.json();
        setSummary(result.summary || []);
      } catch (err) {
        setError('Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchSummary();
  }, [searchParams, termFilter, reportType]);

  const handleTermChange = (e) => {
    const newTerm = e.target.value;
    setTermFilter(newTerm);
    setSearchParams({ ...(newTerm && { term: newTerm }), type: reportType });
  };

  const handleReportTypeChange = (e) => {
    const newType = e.target.value;
    setReportType(newType);
    setSearchParams({ ...(termFilter && { term: termFilter }), type: newType });
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
          <div className="relative">
            <label className="text-white text-lg font-medium">Filter by Term:</label>
            <select
              value={termFilter}
              onChange={handleTermChange}
              className="ml-2 p-3 w-48 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua transition-all duration-300 hover:bg-aqua/10 appearance-none cursor-pointer"
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
          <div className="relative">
            <label className="text-white text-lg font-medium">Report Type:</label>
            <select
              value={reportType}
              onChange={handleReportTypeChange}
              className="ml-2 p-3 w-48 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua transition-all duration-300 hover:bg-aqua/10 appearance-none cursor-pointer"
            >
              <option value="scores">Test Scores</option>
              <option value="fees">Fees</option>
            </select>
            <div className="absolute right-4 top-12 pointer-events-none text-aqua">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
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