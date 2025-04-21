import React, { useState } from 'react';
import ContactForm from '../components/Contact-form.jsx';
import "../Styles/StylesContact.css";
import "../Styles/StylesContact-form.css";
import { Helmet } from "react-helmet";

const Contact = () => {
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <div className="contact-page">
      <Helmet>
        <title>Contact | My Website</title>
      </Helmet>

      <div className="contact-box">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <div className="contact-info">
          <p><strong>Address:</strong> 123 Main Street, City</p>
          <p><strong>Email:</strong> contact@example.com</p>
          <p><strong>Phone:</strong> +216 12 345 678</p>
        </div>

        <ContactForm onSuccess={setSuccessMessage} />
        {successMessage && <p className="message-status">{successMessage}</p>}

        <div className="contact-map-wrapper">
        <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51093.285881302894!2d10.06199314863282!3d36.8345632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3310ff21dfab%3A0x4c0a9520603b9866!2sR%C3%A9sidence%20Green!5e0!3m2!1sfr!2stn!4v1744903867446!5m2!1sfr!2stn"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps Location"
      ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
