import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./About.css";

const About = ({ onCategorySelect, onProjectSelect }) => {
  const [projectImages, setProjectImages] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5000/api/projects/category-preview")
      .then((res) => res.json())
      .then((data) => setProjectImages(data))
      .catch(console.error);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProjectClick = (project) => {
    // ✅ Only main category selected
    onCategorySelect({ category: project.category, subcategory: null });
    onProjectSelect(null);
    navigate("/");
  };

  const categories = [
    {
      title: "ARCHITECTURE",
      apiKey: "Architecture",
      description1: "Crafting expressive buildings that merge form, function, and social impact.",
      description2:
        "Architecture at its best inspires, connects, and empowers. We design spaces that are more than structures — they are experiences shaped by the needs and dreams of the communities they serve.",
    },
    {
      title: "URBAN PLANNING",
      apiKey: "Urban Planning",
      description1: "Shaping the future of urban spaces through strategic, large-scale design solutions.",
      description2:
        "Urban planning is where vision meets systems. Our plans imagine cities as dynamic frameworks for culture, economy, and nature — anticipating the future without forgetting the past.",
    },
    {
      title: "INTERIOR",
      apiKey: "Interior",
      description1: "Designing immersive and functional interior environments for diverse settings.",
      description2:
        "Our interiors elevate daily experiences. We craft spatial narratives that reflect the identity of users while ensuring comfort, flexibility, and elegance across offices, hospitality, and institutions.",
    },
    {
      title: "LANDSCAPE",
      apiKey: "Landscape",
      description1: "Designing green, human-centric environments that integrate with urban and natural ecosystems.",
      description2:
        "Our landscape practice blends ecology, functionality, and beauty to form open spaces that support wellbeing and biodiversity. These are immersive, living systems that thrive alongside urban development.",
    },
  ];

  return (
    <div className="about-page slide-in-card">
      <section className="intro">
        <h1 className="about-heading">ABOUT</h1>
        <div className="intro-split">
          <div className="intro-left">
            <p>
              The extraordinary complexity of the world we inhabit is not something we can ignore.
              We take this as a call to action, not a reason for despair. BIG’s designs emerge out of
              a careful analysis of how contemporary life constantly evolves and changes.
            </p>
          </div>
          <div className="intro-right">
            <p>
              BIG has grown organically over the last two decades from a founder’s apartment to a
              full-service architecture, engineering, landscape, planning and product design company.
              Our studio is currently involved in projects throughout Europe, North America, Asia and
              the Middle East.
            </p>
          </div>
        </div>
      </section>

      <section className="about-image">
        <img
          src="http://localhost:5000/assets/about.webp"
          alt="About"
        />
      </section>

      {categories.map(({ title, apiKey, description1, description2 }) => (
        <SectionBlock
          key={title}
          title={title}
          description1={description1}
          description2={description2}
          projects={projectImages[apiKey] || []}
          onProjectClick={handleProjectClick}
        />
      ))}

      <footer className="about-footer">
        <div className="back-to-top" onClick={handleBackToTop}>
          BACK TO TOP
        </div>
      </footer>
    </div>
  );
};

const SectionBlock = ({ title, description1, description2, projects, onProjectClick }) => (
  <section className="section-block">
    <h2 className="section-title">{title}</h2>
    <div className="section-description-block">
      <p className="section-description">{description1}</p>
      <p className="section-description">{description2}</p>
    </div>
    <div className="section-grid-row" style={{ justifyContent: "center" }}>
      {projects.map((project) => (
        <div
          key={project._id}
          className="section-image-wrapper"
          onClick={() => onProjectClick(project)}
        >
          <img
            src={`http://localhost:5000${project.img}`}
            alt={project.title}
            className="project-img"
            style={{ borderRadius: 0 }}
          />
          <div className="overlay">
            <div className="overlay-text">{project.title}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default About;
