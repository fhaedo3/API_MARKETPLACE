// IMPORTS
import { Link } from 'react-router-dom';
import './Footer.css';

// COMPONENTE FOOTER
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* LOGO Y DESCRIPCIÓN */}
                    <div className="footer-section">
                        <div className="footer-logo">
                            <div className="logo-icon">🛒⚽</div>
                            <span className="logo-text">SCOUTMARKET</span>
                        </div>
                    </div>

                    {/* ENLACES PRINCIPALES */}
                    <div className="footer-section">
                        <h4 className="footer-title">Info</h4>
                        <ul className="footer-links">
                            <li><Link to="/">About</Link></li>
                            <li><Link to="/">Contact</Link></li>
                            <li><Link to="/">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Features</h4>
                        <ul className="footer-links">
                            <li><Link to="/players">Buy Players</Link></li>
                            <li><Link to="/players">Sell Players</Link></li>
                            <li><Link to="/players">Trade</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Tools</h4>
                        <ul className="footer-links">
                            <li><Link to="/players">Search</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Helpful Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Support</Link></li>
                            <li><Link to="/">Community</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Policies</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Terms of Service</Link></li>
                            <li><Link to="/">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* REDES SOCIALES */}
                <div className="footer-bottom">
                    <div className="social-links">
                        <a href="#" className="social-link">📘</a>
                        <a href="#" className="social-link">📷</a>
                        <a href="#" className="social-link">🐦</a>
                        <a href="#" className="social-link">💼</a>
                        <a href="#" className="social-link">📺</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;