import React from "react";
import { useTranslation } from "react-i18next";
import "../Styles/StylesFooter.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Oussama Graphics. All Rights Reserved</p>
        
      </div>
    </footer>
  );
};

export default Footer;
