import React from 'react';
import { useNavigate } from 'react-router-dom';
import schoolPhoto from '../assets/school.jpg';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-black flex flex-col items-center justify-center py-12 px-6">
      <img src={schoolPhoto} alt="Precious Academy" className="w-full max-w-md rounded-lg shadow-lg mb-6" />
      <h1 className="text-3xl font-bold text-deep-blue dark:text-aqua mb-4">Welcome to Precious Academy</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-xl mb-6">
        Established in 2023, Precious Academy is committed to nurturing young minds and fostering academic excellence.
        Our dedicated staff and innovative programs ensure every student shines brightly.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-deep-blue text-white py-3 px-6 rounded-lg hover:bg-aqua hover:text-dark-black transition duration-300"
      >
        Enter Application
      </button>
    </div>
  );
}

export default Welcome;