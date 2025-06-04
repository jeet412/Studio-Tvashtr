import React, { useEffect, useState, useRef } from 'react';
import '../App.css';

function ProjectGrid({ selectedCategory, selectedProject }) {
  const [allProjects, setAllProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [animateOut, setAnimateOut] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [isShrinking, setIsShrinking] = useState(false);
  const projectRefs = useRef([]);

  // Fetch all projects once
  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        setAllProjects(data);
        setCurrentProjects(data);
      });
  }, []);

  // Filter and reorder projects on category or selectedProject change
  useEffect(() => {
    setAnimateOut(true);

    const timeout = setTimeout(() => {
      // Filter by category
      const filtered = selectedCategory === 'All'
        ? allProjects
        : allProjects.filter(p => p.category === selectedCategory);

      // If selectedProject is present and matches category, put it first
      let reorderedProjects = filtered;

      if (selectedProject && selectedProject.category === selectedCategory) {
        reorderedProjects = [
          selectedProject,
          ...filtered.filter(p => p._id !== selectedProject._id),
        ];
      }

      setCurrentProjects(reorderedProjects);
      setAnimateOut(false);
      setExpandedProjectId(null);
      setCurrentIndex(0); // reset slide index when project list changes
    }, 400);

    return () => clearTimeout(timeout);
  }, [selectedCategory, allProjects, selectedProject]);

  // Intersection observer animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('zoom-in');
          } else {
            entry.target.classList.remove('zoom-in');
          }
        });
      },
      { threshold: 0.4 }
    );

    projectRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      projectRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [currentProjects]);

  // Scroll to selectedProject if provided
  useEffect(() => {
    if (selectedProject && currentProjects.length > 0) {
      const index = currentProjects.findIndex(p => p._id === selectedProject._id);
      if (index !== -1 && projectRefs.current[index]) {
        setTimeout(() => {
          const el = projectRefs.current[index];
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setExpandedProjectId(selectedProject._id);
          setCurrentIndex(0);
        }, 500);
      }
    }
  }, [selectedProject, currentProjects]);

  const toggleExpand = (id) => {
    if (expandedProjectId === id) {
      setIsShrinking(true);
      setTimeout(() => {
        setExpandedProjectId(null);
        setIsShrinking(false);
        setCurrentIndex(0);
      }, 800);
    } else {
      setExpandedProjectId(id);
      setCurrentIndex(0);
      const index = currentProjects.findIndex(p => p._id === id);
      if (index !== -1) {
        setTimeout(() => {
          const el = projectRefs.current[index];
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 700);
      }
    }
  };

  const handleNext = (mediaLength, e) => {
    e.stopPropagation();
    if (currentIndex < mediaLength - 1) {
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setSlideDirection('');
      }, 800);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setSlideDirection('');
      }, 800);
    }
  };

  return (
    <div className={`container py-5 ${animateOut ? 'slide-out-card' : 'slide-in-card'}`}>
      {currentProjects.map((project, idx) => {
        const isExpanded = expandedProjectId === project._id;
        const media = project.media?.[currentIndex] || {};

        return (
          <div
            key={project._id}
            ref={el => (projectRefs.current[idx] = el)}
            className={`project-wrapper ${isExpanded ? 'expanded' : ''} ${isShrinking ? 'shrink' : ''}`}
            onClick={() => toggleExpand(project._id)}
          >
            {isExpanded ? (
              <div className="expanded-container">
                <div className="expanded-text-left">
                  <h5>{project.title}</h5>
                  <p>{project.date} — {project.location}</p>
                </div>

                <div className="expanded-image-wrapper">
                  <div className="expanded-image">
                    <img
                      src={media.img || project.img}
                      alt={project.title}
                      className="base-image"
                    />
                    {slideDirection && (
                      <img
                        src={
                          slideDirection === 'right'
                            ? project.media?.[currentIndex + 1]?.img
                            : project.media?.[currentIndex - 1]?.img
                        }
                        alt="next"
                        className={`slide-image slide-in-${slideDirection}`}
                        onAnimationEnd={() => {
                          setCurrentIndex(prev =>
                            slideDirection === 'right' ? prev + 1 : prev - 1
                          );
                          setSlideDirection('');
                        }}
                      />
                    )}
                  </div>

                  <button className="close-btn" onClick={(e) => { e.stopPropagation(); toggleExpand(project._id); }}>×</button>
                  <button
                    className="nav-btn left"
                    onClick={(e) => handlePrev(e)}
                    disabled={currentIndex === 0}
                  >
                    ‹
                  </button>
                  <button
                    className="nav-btn right"
                    onClick={(e) => handleNext(project.media.length, e)}
                    disabled={currentIndex === project.media.length - 1}
                  >
                    ›
                  </button>
                </div>

                <div className="expanded-text-right">
                  <p>{media.description}</p>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center mb-4 project-static" style={{ gap: '20px', cursor: 'pointer' }}>
                <div className="project-text">
                  <h5 className="mb-1">{project.title}</h5>
                  <p className="mb-0 text-muted">
                    {project.date} — {project.location}
                  </p>
                </div>

                <div className="project-card position-relative overflow-hidden">
                  <img
                    src={project.img}
                    className="img-fluid"
                    alt={project.title}
                  />
                  <div className="overlay d-flex align-items-center justify-content-center">
                    <h5 className="text-white text-center">{project.title}</h5>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProjectGrid;
