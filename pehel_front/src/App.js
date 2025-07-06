import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import About from './pages/About'; 

function App() {
  // selectedCategory is always an object: { category: string, subcategory: string|null }
  const [selectedCategory, setSelectedCategory] = useState({ category: 'All', subcategory: null });
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCategorySelect = (categoryObj) => {
    setSelectedCategory(categoryObj);
    setSelectedProject(null);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    if (project) {
      setSelectedCategory({ category: project.category, subcategory: project.subcategory || null });
    }
  };

  return (
    <Router>
      <Navbar
        selectedCategory={selectedCategory}
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
        <Route path="/about" element={<About onCategorySelect={handleCategorySelect}
      onProjectSelect={handleProjectSelect}/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
