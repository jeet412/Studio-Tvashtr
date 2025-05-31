import React, { useState } from "react";
import Swal from "sweetalert2";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "Thanks for contacting us! We'll get back to you soon.",
          confirmButtonColor: "#007bff",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again.",
          confirmButtonColor: "#dc3545",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to send message. Please try later.",
        confirmButtonColor: "#dc3545",
      });
    }

    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}

<div className={loading ? "contact-container blur fade-in" : "contact-container fade-in"}>
        <h2 className="text-center mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Name here"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Mail Id"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              rows="4"
              className="form-control"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Write your message here..."
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        
      </div>
    </>
  );
}

export default Contact;
