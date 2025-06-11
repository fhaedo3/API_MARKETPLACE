import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-content">
                {/* LOGO */}
                <Link to="/" className="logo">
                    <img src="/images/Logo.png" alt="ScoutMarket Logo" className="logo-img" />
                </Link>

                {/* NAVIGATION - Desktop */}
                <nav className="nav desktop-nav">
                    <a href="#hero" className="nav-link">Home</a>
                    <a href="#services" className="nav-link">Services</a>
                    <a href="#how-to-use" className="nav-link">How to Use</a>
                    <a href="#best-players" className="nav-link">Top Players</a>
                </nav>

                {/* USER ACTIONS - Desktop */}
                <div className="logOut-button">
                    <Link to="/login">
                        <button className="logOut-btn">
                            Register / Login 👥
                        </button>
                    </Link>
                </div>

                {/* HAMBURGER MENU BUTTON - Mobile */}
                <button
                    className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>

            {/* MOBILE MENU */}
            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                {/* NAVIGATION - Mobile */}
                <nav className="mobile-nav">
                    <a href="#hero" className="nav-link">Home</a>
                    <a href="#services" className="nav-link">Services</a>
                    <a href="#how-to-use" className="nav-link">How to Use</a>
                    <a href="#best-players" className="nav-link">Top Players</a>
                </nav>

                {/* USER ACTIONS - Mobile */}
                <div className="logOut-button">
                    <Link to="/login" onClick={toggleMenu}>
                        <button className="logOut-btn">
                            Register / Login 👥
                        </button>
                    </Link>
                </div>
            </div>

            {/* OVERLAY para cerrar el menú */}
            {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
};

export default Header;
