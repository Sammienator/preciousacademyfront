import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    schoolCode: '',
    age: '',
    grade: '',
    parentName: '',
    parentContact: '',
    dateOfBirth: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Student added successfully!');
        setFormData({
          name: '',
          schoolCode: '',
          age: '',
          grade: '',
          parentName: '',
          parentContact: '',
          dateOfBirth: '',
          address: '',
        });
        setTimeout(() => navigate('/students'), 2000);
      } else {
        setMessage(result.message || 'Failed to add student');
      }
    } catch (err) {
      setMessage('Failed to add student: Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6">
      <h2 className="text-4xl font-extrabold text-deep-blue dark:text-aqua text-center mb-10 animate-fade-in">
        Add New Student
      </h2>
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        {message && (
          <p className={`text-center mb-6 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-aqua rounded dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">School Code</label>
            <input
              type="text"
              name="schoolCode"
              value={formData.schoolCode}
              onChange={handleChange}
              className="w-full p-3 border border-aqua rounded dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-3 border border-aqua rounded dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Grade</label>
            <input
              type="number"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-3 border border-aqua rounded dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Parent Name</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              className="w-full p-3 border border-aqua rounded dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Parent Contact</label>
            <input
              type="text"
              name="parentContact"
              value={formData.parentContact}
              onChange={handleChange}
              className="w-full p-3 border border-aqua rounded dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-3 border border-aqua rounded dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-aqua rounded dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-deep-blue text-white py-3 rounded-lg hover:bg-aqua hover:text-dark-black transition duration-300"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;