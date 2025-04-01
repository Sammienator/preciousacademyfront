import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [students, setStudents] = useState(0);
  const [grades, setGrades] = useState(0);
  const [activities, setActivities] = useState(0);
  const [branches, setBranches] = useState(0);

  // Hardcoded target values for Precious Academy
  const targetStudents = 500; // Example total students
  const targetGrades = 13; // 13 grades
  const targetActivities = 10; // Example number of extracurricular activities
  const targetBranches = 4; // Four branches

  useEffect(() => {
    // Countdown animation effect
    const animateCount = (setter, target, duration) => {
      let start = 0;
      const stepTime = Math.abs(Math.floor(duration / target));
      const timer = setInterval(() => {
        start += 1;
        setter(start);
        if (start >= target) {
          setter(target); // Ensure it stops at the exact target
          clearInterval(timer);
        }
      }, stepTime);
    };

    // Start animations with slight delays for a cascading effect
    animateCount(setStudents, targetStudents, 2000);
    setTimeout(() => animateCount(setGrades, targetGrades, 1500), 300);
    setTimeout(() => animateCount(setActivities, targetActivities, 1800), 600);
    setTimeout(() => animateCount(setBranches, targetBranches, 1200), 900);
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-4xl font-extrabold text-deep-blue dark:text-aqua mb-10 text-center animate-bounce">
        Welcome to Precious Academy
      </h2>

      {/* Stacked Components */}
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Total Students Card */}
        <div className="bg-deep-blue text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-semibold">Total Students</h3>
          <p className="text-5xl font-bold mt-2">{students}</p>
          <p className="mt-2 text-sm opacity-80">
            A thriving community of learners from diverse backgrounds.
          </p>
        </div>

        {/* Total Grades Card */}
        <div className="bg-aqua text-dark-black p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-semibold">Grades</h3>
          <p className="text-5xl font-bold mt-2">{grades}</p>
          <p className="mt-2 text-sm opacity-80">
            Comprehensive education from Kindergarten to Grade 12.
          </p>
        </div>

        {/* Extracurricular Activities Card */}
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-semibold">Activities</h3>
          <p className="text-5xl font-bold mt-2">{activities}</p>
          <p className="mt-2 text-sm opacity-80">
            Enriching programs like sports, arts, and science clubs.
          </p>
        </div>

        {/* Branches Card */}
        <div className="bg-teal-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-semibold">Branches</h3>
          <p className="text-5xl font-bold mt-2">{branches}</p>
          <p className="mt-2 text-sm opacity-80">
            Four locations spreading excellence across the region.
          </p>
        </div>
      </div>

      {/* Longer Text Section */}
      <div className="mt-12 max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-semibold text-deep-blue dark:text-aqua mb-4 animate-fade-in">
          About Precious Academy
        </h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed animate-fade-in">
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