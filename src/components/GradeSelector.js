import React from 'react';

function GradeSelector({ selectedGrade, handleGradeChange }) {
  const grades = Array.from({ length: 13 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <label className="text-deep-blue dark:text-aqua font-medium">Select Grade:</label>
      <select
        value={selectedGrade || ''}
        onChange={(e) => handleGradeChange(e.target.value ? parseInt(e.target.value) : '')}
        className="p-2 border border-aqua rounded-lg focus:ring-aqua focus:border-aqua dark:bg-gray-800 dark:text-white"
      >
        <option value="">All Grades</option>
        {grades.map(grade => (
          <option key={grade} value={grade}>{grade}</option>
        ))}
      </select>
    </div>
  );
}

export default GradeSelector;