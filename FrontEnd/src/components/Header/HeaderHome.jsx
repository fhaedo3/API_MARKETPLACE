// IMPORTS
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

// COMPONENTE HEADER
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = () => {
        // Aquí puedes implementar la lógica de búsqueda
        console.log('Searching for:', searchTerm);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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
                {/* SEARCH BAR - Mobile */}
                <div className="search-container mobile-search">
                    <input
                        type="text"
                        placeholder="Search For Name Or Position"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-btn" onClick={handleSearch}>🔍</button>
                </div>

                {/* NAVIGATION - Mobile */}
                <nav className="mobile-nav">
                <a href="#hero" className="nav-link">Home</a>
                <a href="#services" className="nav-link">Services</a>
                <a href="#how-to-use" className="nav-link">How to Use</a>
                <a href="#best-players" className="nav-link">Top Players</a>
                </nav>

                {/* USER ACTIONS - Mobile */}
                <div className="logOut-button">
                    <Link to="/join" onClick={toggleMenu}>
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