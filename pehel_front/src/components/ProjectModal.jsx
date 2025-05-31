import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import './ProjectModal.css'; // Ensure this file includes styles from previous message

function ProjectModal({ project, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = project?.media[currentIndex];

 
  if (!project) return null;

  const handleNext = () => {
    if (currentIndex < project.media.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div
        className="project-modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent close on inside click
      >
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-body d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
          {/* Left: Title & Location */}
          <div className="modal-info text-white text-center text-md-start">
            <h4>{project.title}</h4>
            <p className="mb-1 small">
              {project.date} — {project.location}
            </p>
          </div>

          {/* Center: Image + Arrows */}
          <div className="modal-image-wrapper position-relative">
            <img
              src={currentMedia.img}
              alt={project.title}
              className="img-fluid modal-image"
            />
            {currentIndex > 0 && (
              <button className="arrow-btn left" onClick={handlePrev}>
                <FaChevronLeft />
              </button>
            )}
            {currentIndex < project.media.length - 1 && (
              <button className="arrow-btn right" onClick={handleNext}>
                <FaChevronRight />
              </button>
            )}
          </div>

          {/* Right: Description */}
          <div className="modal-description text-light text-center text-md-start">
            <p>{currentMedia.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
