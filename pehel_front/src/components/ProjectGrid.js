import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import { FaEnvelope, FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ProjectGrid({ selectedCategory, selectedProject }) {
  const [allProjects, setAllProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [animateOut, setAnimateOut] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [isShrinking, setIsShrinking] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const projectRefs = useRef([]);
  const scrollWrapperRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollLeftStart = useRef(0);

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

  // Mouse dragging scroll for expanded content
  useEffect(() => {
    const el = scrollWrapperRef.current;
    if (!el) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      dragStartX.current = e.pageX - el.offsetLeft;
      scrollLeftStart.current = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - dragStartX.current) * 1.2;
      el.scrollLeft = scrollLeftStart.current - walk;
    };

    const handleMouseUpOrLeave = () => {
      isDragging.current = false;
      el.style.cursor = 'grab';
      el.style.removeProperty('user-select');
    };

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUpOrLeave);
    el.addEventListener('mouseleave', handleMouseUpOrLeave);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseup', handleMouseUpOrLeave);
      el.removeEventListener('mouseleave', handleMouseUpOrLeave);
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
            <div className="project-static d-flex align-items-center mb-4" style={{ cursor: 'pointer' }}>
            {isExpanded ? (
  <div className="expanded-wrapper w-100 position-relative">
    <button
      className="scroll-button left"
      onClick={(e) => {
        e.stopPropagation();
        scrollWrapperRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      }}
    >
      <i className="fas fa-chevron-left"></i>
    </button>
    <button
      className="scroll-button right"
      onClick={(e) => {
        e.stopPropagation();
        scrollWrapperRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      }}
    >
      <i className="fas fa-chevron-right"></i>
    </button>

    <div className="expanded-scroll-container" ref={scrollWrapperRef}>
  {/* Slide 1 - Meta Info */}
  <div className="project-meta-column">
    <div>
      <h4>{project.title}</h4>
      <p>{project.location}</p>
      <p>{project.date}</p>
      <div className="info-group">
        <p>CLIENT<br />{project.client }</p>
        <p>TYPOLOGY<br />{project.typology }</p>
        <p>SIZE<br />{project.size }</p>
        <p>STATUS<br />{project.status }</p>
      </div>
    </div>
    <div className="share-buttons">
      <a href="#"><FaEnvelope size={18} /></a>
      <a href="#"><FaFacebookF size={18} /></a>
      <a href="#"><FaLinkedinIn size={18} /></a>
      <a href="#"><FaXTwitter size={18} /></a>
    </div>
  </div>

  {/* Slide 2 - Main Project Image */}
  <img className="project-image-slide" src={project.img} alt={project.title} />

  {/* Slide 3+ - Dynamic Content */}
  {(() => {
    let slides = [];

    try {
      if (Array.isArray(project.slides)) {
        slides = project.slides;
      } else if (typeof project.slides === 'string') {
        slides = JSON.parse(project.slides);
      }
    } catch (err) {
      console.error('Error parsing slides:', err);
    }

    return (
      <>
        {slides.map((slide, index) => {
          if (slide.type === 'text') {
            return (
              <div key={index} className="project-text-slide">
                <p>{slide.text}</p>
              </div>
            );
          } else if (slide.type === 'image') {
            return (
              <img
                key={index}
                className="project-image-slide"
                src={slide.image}
                alt={`Slide ${index}`}
              />
            );
          } else if (slide.type === 'mixed') {
            return (
              <div key={index} className="project-slide-combined">
                {slide.image && <img src={slide.image} alt={`Slide ${index}`} />}
                {slide.text && <p>{slide.text}</p>}
              </div>
            );
          }
          return null;
        })}
      </>
    );
  })()}
</div>



  </div>
) : (
  <>
    <div className="image-scroll-wrapper d-flex align-items-center mx-3">
      <div className="project-card uniform position-relative overflow-hidden" style={{
        overflowX: 'hidden',
        whiteSpace: 'normal',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img
          src={project.img}
          className="uniform-size"
          alt={project.title}
          style={{ display: 'inline-block' }}
        />
        {!isMobile && (
          <div className="overlay d-flex align-items-center justify-content-center">
            <h5 className="text-white text-center">{project.title}</h5>
          </div>
        )}
      </div>
    </div>
    <div className="project-text ms-3">
      <h5 className="mb-1">{project.title}</h5>
      <p className="mb-0 text-muted">{project.date} — {project.location}</p>
    </div>
  </>
)}


            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectGrid;
