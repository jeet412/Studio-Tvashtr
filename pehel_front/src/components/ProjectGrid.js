import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ProjectGrid({ selectedCategory, selectedProject }) {
  const [allProjects, setAllProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [animateOut, setAnimateOut] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [isShrinking, setIsShrinking] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const projectRefs = useRef([]);
  const expandedScrollRef = useRef(null);

  // Track screen width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/projects`)
    .then((res) => res.json())
      .then((data) => {
        setAllProjects(data);
        setCurrentProjects(data);
      });
  }, []);

  useEffect(() => {
    setAnimateOut(true);
    const timeout = setTimeout(() => {
      let filtered = allProjects;

      if (selectedCategory.category && selectedCategory.category !== 'All') {
        filtered = allProjects.filter((p) => p.category === selectedCategory.category);
        if (selectedCategory.subcategory) {
          filtered = filtered.filter((p) => p.subcategory === selectedCategory.subcategory);
        }
      }

      let reorderedProjects = filtered;

      if (selectedProject && filtered.find((p) => p._id === selectedProject._id)) {
        reorderedProjects = [
          selectedProject,
          ...filtered.filter((p) => p._id !== selectedProject._id),
        ];
      }

      setCurrentProjects(reorderedProjects);
      setAnimateOut(false);
      setExpandedProjectId(null);
    }, 400);

    return () => clearTimeout(timeout);
  }, [selectedCategory, allProjects, selectedProject]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isExpanded = entry.target.classList.contains('expanded');
          if (entry.isIntersecting && !isExpanded) {
            entry.target.classList.add('zoom-in');
          } else {
            entry.target.classList.remove('zoom-in');
          }
        });
      },
      { threshold: 0.4 }
    );

    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      projectRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [currentProjects]);

  useEffect(() => {
    if (selectedProject && currentProjects.length > 0) {
      const index = currentProjects.findIndex((p) => p._id === selectedProject._id);
      if (index !== -1 && projectRefs.current[index]) {
        setTimeout(() => {
          const el = projectRefs.current[index];
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setExpandedProjectId(selectedProject._id);
        }, 500);
      }
    }
  }, [selectedProject, currentProjects]);

  const toggleExpand = (id) => {
    if (expandedProjectId === id) return;
    setExpandedProjectId(id);
    setTimeout(() => {
      const index = currentProjects.findIndex((p) => p._id === id);
      if (index !== -1 && projectRefs.current[index]) {
        projectRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  const scrollLeft = () => {
    if (expandedScrollRef.current) {
      expandedScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (expandedScrollRef.current) {
      expandedScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleEdgeClick = (e) => {
    const el = expandedScrollRef.current;
    if (!el || window.innerWidth > 768) return;

    const bounds = el.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const edgeWidth = bounds.width * 0.1;

    if (x < edgeWidth) {
      scrollLeft();
    } else if (x > bounds.width - edgeWidth) {
      scrollRight();
    }
  };

  useEffect(() => {
    const el = expandedScrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDownHandler = (e) => {
      isDown = true;
      el.classList.add('dragging');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const mouseUpHandler = () => {
      isDown = false;
      el.classList.remove('dragging');
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', mouseDownHandler);
    el.addEventListener('mouseleave', mouseUpHandler);
    el.addEventListener('mouseup', mouseUpHandler);
    el.addEventListener('mousemove', mouseMoveHandler);
    el.addEventListener('click', handleEdgeClick);

    return () => {
      el.removeEventListener('mousedown', mouseDownHandler);
      el.removeEventListener('mouseleave', mouseUpHandler);
      el.removeEventListener('mouseup', mouseUpHandler);
      el.removeEventListener('mousemove', mouseMoveHandler);
      el.removeEventListener('click', handleEdgeClick);
    };
  }, [expandedProjectId]);

  return (
    <div className={`container py-5 ${animateOut ? 'slide-out-card' : 'slide-in-card'}`}>
      {currentProjects.map((project, idx) => {
        const isExpanded = expandedProjectId === project._id;

        return (
          <div
            key={project._id}
            ref={(el) => (projectRefs.current[idx] = el)}
            className={`project-wrapper ${isExpanded ? 'expanded' : ''} ${isShrinking ? 'shrink' : ''}`}
            onClick={() => toggleExpand(project._id)}
            
          >
            <div className="project-static d-flex align-items-center mb-4" style={{
    cursor: 'pointer',
    position: 'relative',
   
    
  }}>
              {isExpanded && (
                <button className="scroll-btn left-btn" onClick={(e) => { e.stopPropagation(); scrollLeft(); }} aria-label="Scroll left">
                  ‹
                </button>
              )}

              <div className="image-scroll-wrapper d-flex align-items-center mx-3">
                <div
                  className={`project-card uniform position-relative ${isExpanded ? 'expanded-img' : 'overflow-hidden'}`}
                  ref={isExpanded ? expandedScrollRef : null}
                  style={{
                    overflowX: isExpanded ? 'auto' : 'hidden',
                    whiteSpace: isExpanded ? 'nowrap' : 'normal',
                  }}
                >
                  <img
                    src={isExpanded ? project.fullImg || project.img : project.img}
                    className="uniform-size"
                    alt={project.title}
                    style={{ display: 'inline-block', pointerEvents: isExpanded ? 'none' : 'auto' }}
                  />
                  {!isExpanded && !isMobile && (
                    <div className="overlay d-flex align-items-center justify-content-center">
                      <h5 className="text-white text-center">{project.title}</h5>
                    </div>
                  )}
                </div>
              </div>

              {isExpanded && (
                <button className="scroll-btn right-btn" onClick={(e) => { e.stopPropagation(); scrollRight(); }} aria-label="Scroll right">
                  ›
                </button>
              )}

{!isExpanded && (
  <div className="project-text ms-3">
    <h5 className="mb-1">{project.title}</h5>
    <p className="mb-0 text-muted">{project.date} — {project.location}</p>
  </div>
)}

            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectGrid;
