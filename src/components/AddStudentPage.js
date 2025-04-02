import React, { useState } from 'react';

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
    enrollmentDate: new Date().toISOString().split('T')[0],
  });
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const studentData = {
        ...formData,
        age: Number(formData.age),
        grade: Number(formData.grade),
        dateOfBirth: new Date(formData.dateOfBirth),
        enrollmentDate: new Date(formData.enrollmentDate),
      };

      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Student added successfully');
        setFormData({
          name: '',
          schoolCode: '',
          age: '',
          grade: '',
          parentName: '',
          parentContact: '',
          dateOfBirth: '',
          address: '',
          enrollmentDate: new Date().toISOString().split('T')[0],
        });
      } else {
        setMessage(`Failed to add student: ${result.message}`);
      }
    } catch (error) {
      setMessage('Failed to add student: Network error');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-deep-blue dark:text-white mb-4">Add New Student</h2>
      {message && (
        <p className={`mb-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-deep-blue dark:text-white">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-deep-blue dark:text-white">School Code:</label>
          <input
            type="text"
            name="schoolCode"
            value={formData.schoolCode}
            onChange={handleChange}
            required
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-deep-blue dark:text-white">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-deep-blue dark:text-white">Grade:</label>
          <input
            type="number"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            min="1"
            max="13"
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-deep-blue dark:text-white">Parent Name:</label>
          <input
            type="text"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-deep-blue dark:text-white">Parent Contact:</label>
          <input
            type="text"
            name="parentContact"
            value={formData.parentContact}
            onChange={handleChange}
            required
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-deep-blue dark:text-white">Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-deep-blue dark:text-white">Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-deep-blue dark:text-white">Enrollment Date:</label>
          <input
            type="date"
            name="enrollmentDate"
            value={formData.enrollmentDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-aqua rounded dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="bg-aqua text-dark-black px-4 py-2 rounded-lg hover:bg-white transition duration-300"
        >
          Save Student
        </button>
      </form>
    </div>
  );
};

export default AddStudentPage;