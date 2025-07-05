import React, { useEffect, useState } from 'react';
import './Home.css';
import Projects from '../components/ProjectGrid';

function Home({ selectedCategory, selectedProject }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
      {/* <h1 className="hero-title">WE CREATE ARCHITECTURE</h1> */}
        <p className="lead">STUDIO TVSASHT</p>
      </div>

      {/* Slide-in wrapper for projects */}
      <div className={`projects-wrapper ${animate ? 'slide-in' : ''}`}>
        <Projects selectedCategory={selectedCategory} selectedProject={selectedProject} />
      </div>
    </div>
  );
}

export default Home;
