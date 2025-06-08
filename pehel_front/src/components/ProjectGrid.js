import React, { useEffect, useState, useRef } from 'react';
import '../App.css';

function ProjectGrid({ selectedCategory, selectedProject }) {
  const [allProjects, setAllProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [animateOut, setAnimateOut] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [isShrinking, setIsShrinking] = useState(false);
  const projectRefs = useRef([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
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
    if (expandedProjectId === id) {
      setIsShrinking(true);
      setTimeout(() => {
        setExpandedProjectId(null);
        setIsShrinking(false);
      }, 800);
    } else {
      setExpandedProjectId(id);
      setTimeout(() => {
        const index = currentProjects.findIndex((p) => p._id === id);
        if (index !== -1 && projectRefs.current[index]) {
          projectRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

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
            <div className="project-static d-flex align-items-center mb-4" style={{ cursor: 'pointer' }}>
              <div className="project-card uniform position-relative overflow-hidden">
                <img
                  src={isExpanded ? project.fullImg || project.img : project.img}
                  className="uniform-size"
                  alt={project.title}
                />
                <div className="overlay d-flex align-items-center justify-content-center">
                  <h5 className="text-white text-center">{project.title}</h5>
                </div>
                {isExpanded && (
                  <button
                    className="close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(project._id);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="project-text">
                <h5 className="mb-1">{project.title}</h5>
                <p className="mb-0 text-muted">
                  {project.date} — {project.location}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectGrid;
