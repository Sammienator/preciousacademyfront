import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [students, setStudents] = useState(0);
  const [grades, setGrades] = useState(0);
  const [activities, setActivities] = useState(0);
  const [branches, setBranches] = useState(0);

  const targetStudents = 500;
  const targetGrades = 13;
  const targetActivities = 10;
  const targetBranches = 4;

  useEffect(() => {
    const animateCount = (setter, target, duration) => {
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration / target));
      const timer = setInterval(() => {
        start += 1;
        setter(start);
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        }
      }, stepTime);
    };

    animateCount(setStudents, targetStudents, 2000);
    setTimeout(() => animateCount(setGrades, targetGrades, 1500), 300);
    setTimeout(() => animateCount(setActivities, targetActivities, 1800), 600);
    setTimeout(() => animateCount(setBranches, targetBranches, 1200), 900);
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-4xl font-extrabold text-deep-blue dark:text-aqua mb-10 text-center animate-pulse">
        Welcome to Precious Academy
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-deep-blue to-teal-500 text-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold">Total Students</h3>
          <p className="text-4xl font-extrabold mt-2">{students}</p>
          <p className="mt-2 text-sm opacity-80">A thriving community of learners.</p>
        </div>
        <div className="bg-gradient-to-r from-aqua to-purple-500 text-dark-black p-6 rounded-xl shadow-xl transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold">Grades</h3>
          <p className="text-4xl font-extrabold mt-2">{grades}</p>
          <p className="mt-2 text-sm opacity-80">From Kindergarten to Grade 12.</p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold">Activities</h3>
          <p className="text-4xl font-extrabold mt-2">{activities}</p>
          <p className="mt-2 text-sm opacity-80">Sports, arts, and science clubs.</p>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold">Branches</h3>
          <p className="text-4xl font-extrabold mt-2">{branches}</p>
          <p className="mt-2 text-sm opacity-80">Four locations across the region.</p>
        </div>
      </div>

      <div className="mt-12 max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-deep-blue dark:text-aqua mb-4">About Precious Academy</h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Precious Academy is more than just a school—it’s a place where dreams take root and futures are built. 
          With 13 grades spanning Kindergarten to Grade 12, we offer a nurturing environment for over 500 students 
          across our four vibrant branches. Our 10 extracurricular activities, from soccer to symphony, ensure 
          every child finds their passion. Established with a vision to inspire, we blend academic rigor with 
          a love for learning, preparing our students to shine in an ever-changing world. Join us, and become 
          part of a legacy of excellence!
        </p>
      </div>
    </div>
  );
}

export default Dashboard;