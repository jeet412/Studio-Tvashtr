import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import ProjectModal from './ProjectModal';

function ProjectGrid({ selectedCategory }) {
  const [allProjects, setAllProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [animateOut, setAnimateOut] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const projectRefs = useRef([]);

  // ✅ Fetch projects from API on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        setAllProjects(data);
        setCurrentProjects(data); // Show all initially
      });
  }, []);

  // ✅ Handle filtering when category changes
  useEffect(() => {
    setAnimateOut(true);
    const timeout = setTimeout(() => {
      const filtered = selectedCategory === 'All'
        ? allProjects
        : allProjects.filter(p => p.category === selectedCategory);
      setCurrentProjects(filtered);
      setAnimateOut(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [selectedCategory, allProjects]);

  // ✅ Scroll animation observer
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

  return (
    <div className={`container py-5 ${animateOut ? 'slide-out-card' : 'slide-in-card'}`}>
      {currentProjects.map((project, idx) => (
        <div
          key={idx}
          ref={el => (projectRefs.current[idx] = el)}
          className={`d-flex align-items-center justify-content-center project-wrapper mb-4 ${idx % 2 === 0 ? 'even' : 'odd'}`}
          style={{ maxWidth: '600px', gap: '20px', cursor: 'pointer' }}
          onClick={() => setSelectedProject(project)}
        >
          <div className="project-text">
            <h5 className="mb-1">{project.title}</h5>
            <p className="mb-0 text-muted">
              {project.date} — {project.location}
            </p>
          </div>

          <div className="project-card position-relative overflow-hidden">
            <img src={project.img} className="img-fluid" alt={project.title} />
            <div className="overlay d-flex align-items-center justify-content-center">
              <h5 className="text-white text-center">{project.title}</h5>
            </div>
          </div>
        </div>
      ))}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default ProjectGrid;
