// IMPORTS
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Footer.css';

// COMPONENTE FOOTER
const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({
    info: false,
    features: false,
    tools: false,
    policies: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="footer">
      <div className="containerfooter">
        <div className="footer-content">
          {/* LOGO Y DESCRIPCIÓN */}
          <div className="footer-section logo-section">
            <div className="footer-logo">
              <img src="/images/Logo.png" alt="ScoutMarket Logo" className="footer-logo-img" />
            </div>
            <p className="footer-description">
              The best marketplace to buy, sell, and trade football players.
              Connect with teams worldwide and build your dream squad.
            </p>
          </div>

          {/* ENLACES PRINCIPALES */}
          <div className="footer-section">
            <div
              className="footer-title-container"
              onClick={() => toggleSection('info')}
            >
              <h4 className="footer-title">Info</h4>
              <span className={`footer-toggle ${expandedSections.info ? 'active' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`footer-links ${expandedSections.info ? 'expanded' : ''}`}>
              <li><Link to="/">About</Link></li>
              <li><Link to="/">Contact</Link></li>
              <li><Link to="/">FAQ</Link></li>
              <li><Link to="/">Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <div
              className="footer-title-container"
              onClick={() => toggleSection('features')}
            >
              <h4 className="footer-title">Features</h4>
              <span className={`footer-toggle ${expandedSections.features ? 'active' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`footer-links ${expandedSections.features ? 'expanded' : ''}`}>
              <li><Link to="/players">Buy Players</Link></li>
              <li><Link to="/players">Sell Players</Link></li>
              <li><Link to="/players">Trade</Link></li>
              <li><Link to="/players">Borrowing</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <div
              className="footer-title-container"
              onClick={() => toggleSection('tools')}
            >
              <h4 className="footer-title">Tools</h4>
              <span className={`footer-toggle ${expandedSections.tools ? 'active' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`footer-links ${expandedSections.tools ? 'expanded' : ''}`}>
              <li><Link to="/players">Search</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/favorites">Favorites</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <div
              className="footer-title-container"
              onClick={() => toggleSection('policies')}
            >
              <h4 className="footer-title">Policies</h4>
              <span className={`footer-toggle ${expandedSections.policies ? 'active' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`footer-links ${expandedSections.policies ? 'expanded' : ''}`}>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Cookie Policy</Link></li>
              <li><Link to="/">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* REDES SOCIALES Y COPYRIGHT */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
              <a href="#" className="social-link" aria-label="YouTube">📺</a>
            </div>
            <div className="copyright">
              <p>&copy; 2024 ScoutMarket. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;