import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';  // Import Home, which contains hero + projects
import Footer from './components/Footer';
import Contact from './pages/Contact';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedProject(null);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setSelectedCategory(project.category);
  };

  return (
    <Router>
      <Navbar
        onCategorySelect={handleCategorySelect}
        onProjectSelect={handleProjectSelect}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              selectedCategory={selectedCategory}
              selectedProject={selectedProject}
            />
          }
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
