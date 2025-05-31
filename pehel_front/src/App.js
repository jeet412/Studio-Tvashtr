import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from "./pages/Contact";
import Footer from './components/Footer';
import Home from './pages/Home';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (<>
    <Router>
      <Navbar onCategorySelect={setSelectedCategory} />
      <Routes>
        <Route
          path="/"
          element={<Home selectedCategory={selectedCategory} />}
        />
         <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
    <Footer />
    </>
  );
}

export default App;
