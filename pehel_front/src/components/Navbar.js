import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import './Navbar.css';

function Navbar({ onCategorySelect, onProjectSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('All');
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    { name: 'Architecture', key: 'Architecture' },
    { name: 'Urban Planning', key: 'Urban Planning' },
    { name: 'Interior', key: 'Interior' },
    { name: 'Landscape', key: 'Landscape' },
  ];

  const handleClick = (e, key) => {
    e.preventDefault();
    setMenuOpen(false);
    setActive(key);
    onCategorySelect(key);
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
          `http://localhost:5000/api/projects/search?q=${encodeURIComponent(value)}`
        );
        if (res.status === 200) {
          setSuggestions(res.data);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
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

    setActive(project.category);
    onCategorySelect(project.category);
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

  const isContactPage = location.pathname === '/contact';

  return (
    <>
      <nav className="big-navbar">
        <div className="mobile-navbar-top d-flex justify-content-between align-items-center">
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </button>

          <button
            className="logo-container btn-no-style"
            onClick={toggleSideMenu}
            aria-label={sideMenuOpen ? 'Close side menu' : 'Open side menu'}
          >
            <img src="/assets/samplelogo.png" alt="Logo" className="navbar-logo" />
          </button>
        </div>

        {/* RIGHT SEARCH SECTION */}
        <div className="search-wrapper" ref={searchRef}>
          {!showSearch ? (
            <FiSearch
              className="search-icon"
              onClick={() => setShowSearch(true)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setShowSearch(true);
              }}
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
                <ul className="search-suggestions">
                  {suggestions.map((project) => (
                    <li
                      key={project._id}
                      onClick={() => handleSuggestionClick(project)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSuggestionClick(project);
                      }}
                    >
                      {project.title}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <div className={`navbar-links-container ${menuOpen ? 'show' : ''}`}>
          <div className="navbar-links">
            {!isContactPage && (
              <>
                <a
                  href="#"
                  onClick={(e) => handleClick(e, 'All')}
                  className={active === 'All' ? 'active-link' : ''}
                >
                  All
                </a>
                {categories.map(({ name, key }) => (
                  <a
                    key={key}
                    href="#"
                    onClick={(e) => handleClick(e, key)}
                    className={active === key ? 'active-link' : ''}
                  >
                    {name}
                  </a>
                ))}
              </>
            )}
            {isContactPage && (
              <Link to="/" className="contact-home-link">
                Home
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <div className={`side-menu ${sideMenuOpen ? 'open' : ''}`}>
        <button
          className="side-menu-close-btn"
          onClick={toggleSideMenu}
          aria-label="Close side menu"
        >
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
