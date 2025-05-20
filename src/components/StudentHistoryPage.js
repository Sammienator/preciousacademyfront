import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const StudentHistoryPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [notes, setNotes] = useState([]);
  const [testForm, setTestForm] = useState({
    term: 'Term 1',
    subjects: { maths: '', english: '', science: '', history: '', geography: '' },
  });
  const [feeForm, setFeeForm] = useState({ term: 'Term 1', status: 'Unpaid' });
  const [noteForm, setNoteForm] = useState('');
  const [message, setMessage] = useState('');

  const API_URL = (process.env.REACT_APP_API_URL || 'https://preciousacademyback-production.up.railway.app')
    .replace(/\/+$/, '')
    .replace(/^\/+/, '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentUrl = `${API_URL}/api/students/${id}`;
        const testUrl = `${API_URL}/api/students/test-results/${id}`;
        const feeUrl = `${API_URL}/api/students/fees/${id}`;
        const noteUrl = `${API_URL}/api/students/notes/${id}`;
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };

        const [studentRes, testRes, feeRes, noteRes] = await Promise.all([
          fetch(studentUrl, { headers }),
          fetch(testUrl, { headers }),
          fetch(feeUrl, { headers }),
          fetch(noteUrl, { headers }),
        ]);

        if (!studentRes.ok) throw new Error('Failed to fetch student');
        if (!testRes.ok) throw new Error('Failed to fetch test results');
        if (!feeRes.ok) throw new Error('Failed to fetch fees');
        if (!noteRes.ok) throw new Error('Failed to fetch notes');

        const [studentData, testData, feeData, noteData] = await Promise.all([
          studentRes.json(),
          testRes.json(),
          feeRes.json(),
          noteRes.json(),
        ]);

        setStudent(studentData.student);
        setTestResults(testData.testResults || testData);
        setFees(feeData.fees || feeData);
        setNotes(noteData.notes || noteData);
      } catch (err) {
        setMessage('Failed to load student data');
      }
    };
    fetchStudentData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (Object.values(testForm.subjects).some((val) => val !== '')) {
        const testResponse = await fetch(`${API_URL}/api/students/test-results/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            term: testForm.term,
            subjects: {
              maths: Number(testForm.subjects.maths) || 0,
              english: Number(testForm.subjects.english) || 0,
              science: Number(testForm.subjects.science) || 0,
              history: Number(testForm.subjects.history) || 0,
              geography: Number(testForm.subjects.geography) || 0,
            },
          }),
        });
        const testResult = await testResponse.json();
        if (testResponse.ok) {
          setTestResults(
            testResults.some((tr) => tr.term === testForm.term)
              ? testResults.map((tr) => (tr.term === testForm.term ? testResult.testResult : tr))
              : [...testResults, testResult.testResult]
          );
          setMessage((prev) => `${prev ? `${prev} | ` : ''}Test results updated successfully`);
        } else {
          setMessage((prev) => `${prev ? `${prev} | ` : ''}${testResult.message}`);
        }
      }

      if (localStorage.getItem('role') === 'admin' && feeForm.term && feeForm.status) {
        const feeResponse = await fetch(`${API_URL}/api/students/fees/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(feeForm),
        });
        const feeResult = await feeResponse.json();
        if (feeResponse.ok) {
          setFees(
            fees.some((f) => f.term === feeForm.term)
              ? fees.map((f) => (f.term === feeForm.term ? feeResult.fee : f))
              : [...fees, feeResult.fee]
          );
          setMessage((prev) => `${prev ? `${prev} | ` : ''}Fee updated successfully`);
        } else {
          setMessage((prev) => `${prev ? `${prev} | ` : ''}${feeResult.message}`);
        }
      }

      if (noteForm.trim()) {
        const noteResponse = await fetch(`${API_URL}/api/students/notes/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ content: noteForm }),
        });
        const noteResult = await noteResponse.json();
        if (noteResponse.ok) {
          setNotes([...notes, noteResult.note]);
          setMessage((prev) => `${prev ? `${prev} | ` : ''}Note added successfully`);
        } else {
          setMessage((prev) => `${prev ? `${prev} | ` : ''}${noteResult.message}`);
        }
      }

      if (!message.includes('Failed')) {
        setTestForm({ term: 'Term 1', subjects: { maths: '', english: '', science: '', history: '', geography: '' } });
        setFeeForm({ term: 'Term 1', status: 'Unpaid' });
        setNoteForm('');
      }
    } catch (err) {
      setMessage('Failed to update student data');
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-deep-blue dark:text-aqua text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6 font-custom">
      <h2 className="text-4xl font-extrabold text-deep-blue dark:text-aqua text-center mb-8 animate-fade-in">
        {student.name} (Grade {student.grade})
      </h2>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
        <p className="text-gray-700 dark:text-gray-300 text-lg">School Code: <span className="font-semibold">{student.schoolCode}</span></p>
        <p className="text-gray-700 dark:text-gray-300 text-lg mt-2">Parent: <span className="font-semibold">{student.parentName}</span></p>
        <p className="text-gray-700 dark:text-gray-300 text-lg mt-2">Parent Contact: <span className="font-semibold">{student.parentContact}</span></p>
      </div>
      {message && (
        <p className={`text-center mb-6 text-lg ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'} animate-fade-in`}>
          {message}
        </p>
      )}

      <div className="max-w-3xl mx-auto mb-10">
        <h3 className="text-2xl font-semibold text-deep-blue dark:text-aqua mb-4">Update Student Records</h3>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <h4 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-3">Test Results</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={testForm.term}
                onChange={(e) => setTestForm({ ...testForm, term: e.target.value })}
                className="w-full p-3 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua transition-all duration-300 hover:bg-aqua/10"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
              {['maths', 'english', 'science', 'history', 'geography'].map((subject) => (
                <input
                  key={subject}
                  type="number"
                  placeholder={subject.charAt(0).toUpperCase() + subject.slice(1)}
                  value={testForm.subjects[subject]}
                  onChange={(e) => setTestForm({ ...testForm, subjects: { ...testForm.subjects, [subject]: e.target.value } })}
                  className="p-3 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-aqua transition duration-200"
                />
              ))}
            </div>
          </div>

          {localStorage.getItem('role') === 'admin' && (
            <div>
              <h4 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-3">Fees</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={feeForm.term}
                  onChange={(e) => setFeeForm({ ...feeForm, term: e.target.value })}
                  className="w-full p-3 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua transition-all duration-300 hover:bg-aqua/10"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
                <select
                  value={feeForm.status}
                  onChange={(e) => setFeeForm({ ...feeForm, status: e.target.value })}
                  className="w-full p-3 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua transition-all duration-300 hover:bg-aqua/10"
                >
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-3">Notes</h4>
            <textarea
              placeholder="Add a note..."
              value={noteForm}
              onChange={(e) => setNoteForm(e.target.value)}
              className="w-full p-3 rounded-lg border border-aqua bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-aqua transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-aqua text-dark-black px-6 py-3 rounded-lg hover:bg-teal-500 hover:text-white transition duration-300 shadow-md"
          >
            Update Student Records
          </button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold text-deep-blue dark:text-aqua mb-4">Student History</h3>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h4 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-3">Test Results</h4>
            {testResults.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No test results yet.</p>
            ) : (
              <ul className="space-y-3">
                {testResults.map((test) => (
                  <li key={test._id} className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span className="font-medium">{test.term}</span>: Maths: {test.subjects.maths}, English: {test.subjects.english}, Science: {test.subjects.science}, History: {test.subjects.history}, Geography: {test.subjects.geography}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h4 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-3">Fees</h4>
            {fees.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No fees recorded yet.</p>
            ) : (
              <ul className="space-y-3">
                {fees.map((fee) => (
                  <li key={fee._id} className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span className="font-medium">{fee.term}</span>: {fee.status}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h4 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-3">Notes</h4>
            {notes.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No notes added yet.</p>
            ) : (
              <ul className="space-y-3">
                {notes.map((note) => (
                  <li key={note._id} className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {note.content} <span className="text-xs text-gray-500 dark:text-gray-400">({new Date(note.date).toLocaleDateString()})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHistoryPage;