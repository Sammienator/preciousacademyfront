import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import './index.css';
import App from './App';
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

// Get the root element
const container = document.getElementById('root');
// Create a root and render the app
const root = createRoot(container);
root.render(<App />);