import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./Contact.css";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: digits });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "Thanks for contacting us! We'll get back to you soon.",
          confirmButtonColor: "#000",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        throw new Error();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#dc3545",
      });
    }
    setLoading(false);
  };

  return (
    <>
      {isMobile && (
        <div className="mobile-heading"  style={{
          padding: "80px 20px 20px", // ← Add top padding to push below navbar
          backgroundColor: "#fff",   // Optional: ensure background doesn't blend
          zIndex: 1,
        }}>
          <h2>Contact Us</h2>
        </div>
      )}

      <div className="contact-card slide-in-card">
        <div className="contact-left">
      
          <h3>GET IN TOUCH</h3>
          <ul>
            <li>
              <i className="fas fa-phone-alt"></i>
              <a href="tel:+10123456789">+1012 3456 789</a>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <a href="mailto:demo@gmail.com">demo@gmail.com</a>
            </li>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <a
                href="https://www.google.com/maps?q=132+Dartmouth+Street+Boston,+Massachusetts+02156"
                target="_blank"
                rel="noopener noreferrer"
              >
                132 Dartmouth Street Boston, Massachusetts 02156 United States
              </a>
            </li>
          </ul>

          <div className="social-icons">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-discord"></i>
            </a>
          </div>
        </div>

        <div className="contact-right">
          <div className="form-container">
            {!isMobile && (
              <>
                <h2>Contact Us</h2>
                <p>Any question or remarks? Just write us a message!</p>
              </>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <div>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-row">
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <small className="error">{errors.email}</small>}
                </div>
                <div>
                  <label>Phone Number</label>
                  <div className="phone-input">
                    <span className="prefix">+91</span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.phone && <small className="error">{errors.phone}</small>}
                </div>
              </div>

              <label>Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />

              <div className="submit-btn-wrapper">
                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
