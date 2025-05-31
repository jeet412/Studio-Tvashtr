import React from 'react';
import { FaInstagram, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import '../App.css';

function Footer() {
  return (
    <footer className="footer-custom py-3">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        
        {/* Address */}
        <div className="footer-address text-center text-md-start mb-2 mb-md-0">
          <h6 className="mb-1 fw-semibold text-white">Studio Address</h6>
          <p className="mb-0 small text-light">
            302, Urban Hive Complex,<br />
            Nr. Riverfront Road, Ahmedabad – 380015<br />
            Gujarat, India
          </p>
        </div>

        {/* Mobile layout */}
        <div className="footer-bottom-mobile d-md-none">
          <div className="footer-connect">
            Tvashtr 
          </div>
          <div className="footer-icons d-flex gap-3">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="footer-icon whatsapp">
              <FaWhatsapp />
            </a>
            <a href="https://instagram.com/yourstudio" target="_blank" rel="noopener noreferrer" className="footer-icon instagram">
              <FaInstagram />
            </a>
            <a href="tel:+919876543210" className="footer-icon phone">
              <FaPhoneAlt />
            </a>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="d-none d-md-block text-center">
          <h5 className="mb-1 stylish-heading">Tvashstr </h5>
        </div>

        <div className="d-none d-md-flex footer-icons gap-3">
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="footer-icon whatsapp">
            <FaWhatsapp />
          </a>
          <a href="https://instagram.com/yourstudio" target="_blank" rel="noopener noreferrer" className="footer-icon instagram">
            <FaInstagram />
          </a>
          <a href="tel:+919876543210" className="footer-icon phone">
            <FaPhoneAlt />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
