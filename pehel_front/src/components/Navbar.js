import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import './Navbar.css';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Navbar({ selectedCategory, onCategorySelect, onProjectSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isStaticPage = ['/contact', '/about'].includes(location.pathname);

  const categories = [
    {
      name: 'Architecture',
      key: 'Architecture',
      subcategories: ['Commercial', 'Residential', 'Institutional', 'Hospitality'],
    },
    {
      name: 'Urban Planning',
      key: 'Urban Planning',
      subcategories: ['City Masterplans', 'Redevelopment'],
    },
    {
      name: 'Interior',
      key: 'Interior',
      subcategories: ['Commercial Office', 'Retail', 'Hospitality', 'Institutional'],
    },
    {
      name: 'Landscape',
      key: 'Landscape',
      subcategories: [],
    },
  ];

  const handleMainCategoryClick = (e, catKey) => {
    e.preventDefault();

    if (window.innerWidth <= 768) {
      setActiveMobileCategory(prev => (prev === catKey ? null : catKey));
    } else {
      if (selectedCategory.category === catKey && selectedCategory.subcategory === null) {
        onCategorySelect({ category: 'All', subcategory: null });
      } else {
        onCategorySelect({ category: catKey, subcategory: null });
      }
      onProjectSelect(null);
    }

    if (window.innerWidth > 768) setMenuOpen(false);
  };

  const handleSubcategoryClick = (e, catKey, subcat) => {
    e.preventDefault();
    onCategorySelect({ category: catKey, subcategory: subcat });
    onProjectSelect(null);
    setMenuOpen(false);
    setActiveMobileCategory(null);
    navigate('/');
  };

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim().length >= 3) {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/projects/search?q=${encodeURIComponent(value)}`
        );
        setSuggestions(res.status === 200 ? res.data : []);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (project) => {
    setSearchInput('');
    setSuggestions([]);
    setShowSearch(false);
    onCategorySelect({ category: project.category, subcategory: project.subcategory || null });
    onProjectSelect(project);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="big-navbar">
        <div className="mobile-navbar-top d-flex justify-content-between align-items-center">
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => {
              setMenuOpen(!menuOpen);
              setActiveMobileCategory(null);
            }}
            aria-label="Toggle menu"
          >
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </button>
          <button className="logo-container btn-no-style" onClick={toggleSideMenu}>
            <img style={{ filter: 'invert(1)' }} src="/assets/samplelogo.jpeg" alt="Logo" className="navbar-logo" />
          </button>
        </div>

        <div className="search-wrapper" ref={searchRef}>
          {!showSearch ? (
            <FiSearch
              className="search-icon"
              onClick={() => setShowSearch(true)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowSearch(true)}
              aria-label="Open search"
            />
          ) : (
            <>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchInput}
                onChange={handleSearchChange}
                className="search-input"
                autoFocus
              />
              {suggestions.length > 0 && (
                <ul className="search-suggestions" role="listbox">
                  {suggestions.map((project) => (
                    <li
                      key={project._id}
                      onClick={() => handleSuggestionClick(project)}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(project)}
                    >
                      {project.title}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* MOBILE NAV LINKS */}
        <div className={`navbar-links-container ${menuOpen ? 'show' : ''}`}>
          <div className="navbar-links">
            {!isStaticPage ? (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onCategorySelect({ category: 'All', subcategory: null });
                    onProjectSelect(null);
                    setMenuOpen(false);
                    setActiveMobileCategory(null);
                  }}
                  className={selectedCategory.category === 'All' ? 'active-link' : ''}
                >
                  All
                </a>

                {categories.map(({ name, key, subcategories }) => (
                  <div key={key} className="mobile-category-block">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.innerWidth <= 768) {
                          if (selectedCategory.category === key && selectedCategory.subcategory === null) {
                            onCategorySelect({ category: 'All', subcategory: null });
                          } else {
                            onCategorySelect({ category: key, subcategory: null });
                          }
                        } else {
                          handleMainCategoryClick(e, key);
                        }
                        onProjectSelect(null);
                      }}
                      className={
                        selectedCategory.category === key && !selectedCategory.subcategory ? 'active-link' : ''
                      }
                    >
                      {name}
                    </a>

                    {menuOpen &&
                      window.innerWidth <= 768 &&
                      selectedCategory.category === key && (
                        <div className="mobile-subcategory-dropdown">
                          {subcategories.map((subcat) => (
                            <a
                              key={subcat}
                              href="#"
                              onClick={(e) => handleSubcategoryClick(e, key, subcat)}
                              className={selectedCategory.subcategory === subcat ? 'active-subcategory' : ''}
                            >
                              {subcat}
                            </a>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </>
            ) : (
              <Link to="/" className="contact-home-link">
                Home
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* DESKTOP SUBCATEGORY BAR */}
      {!isStaticPage && selectedCategory.category !== 'All' && window.innerWidth > 768 && (
        <div className="subcategory-bar">
          {categories
            .find((c) => c.key === selectedCategory.category)
            ?.subcategories.map((subcat) => (
              <a
                key={subcat}
                href="#"
                onClick={(e) => handleSubcategoryClick(e, selectedCategory.category, subcat)}
                className={selectedCategory.subcategory === subcat ? 'active-subcategory' : ''}
              >
                {subcat}
              </a>
            ))}
        </div>
      )}

      {/* SIDE MENU (Contact/About) */}
      <div className={`side-menu ${sideMenuOpen ? 'open' : ''}`}>
        <button className="side-menu-close-btn" onClick={toggleSideMenu} aria-label="Close side menu">
          <span className="close-icon">&times;</span>
        </button>
        <ul className="side-menu-links">
          <li>
            <Link to="/about" onClick={toggleSideMenu} className="side-menu-link">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={toggleSideMenu} className="side-menu-link">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
