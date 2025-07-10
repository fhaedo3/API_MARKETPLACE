// IMPORTS
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { selectIsAuthenticated, selectUsername } from '../../store/slices/authSlice';
import './Header.css';
import { selectCartItemCount } from '../../store/slices/cartSlice';
import { clearCart} from '../../store/slices/cartSlice'; // <-- Agrega este import

// COMPONENTE HEADER
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const username = useSelector(selectUsername);
    const cartItemsCount = useSelector(selectCartItemCount);


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

    const handleLogout = async () => {
    try {
        await dispatch(clearCart()).unwrap(); 
    } catch (error) {
       
        console.error('Error clearing cart on logout:', error);
    }
    dispatch(logout());
    navigate('/');
};

    return (
        <header className="header">
            <div className="header-content">
                {/* LOGO */}
                <Link to="/dashboard" className="logo">
                    <img src="/images/Logo.png" alt="ScoutMarket Logo" className="logo-img" />
                </Link>

                {/* SEARCH BAR - Desktop */}
                {/*
                <div className="search-container desktop-search">
                    <input
                        type="text"
                        placeholder="Search For Name Or Position"
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-btn" onClick={handleSearch}>🔍</button>
                </div>*/}

                {/* NAVIGATION - Desktop */}
                <nav className="nav desktop-nav">
                    <Link to="/players" className="nav-link">Explore</Link>
                    <Link to="/dashboard" className="nav-link">My Team</Link>
                    <Link to="/cart" className="nav-link">
                        Cart ({cartItemsCount})
                    </Link>
                </nav>

                {/* USER ACTIONS - Desktop */}
                <div className="logOut-button desktop-join">
                    {isAuthenticated ? (
                        <button className="logOut-btn" onClick={handleLogout}>
                            Log Out 👥
                        </button>
                    ) : (
                        <Link to="/login">
                            <button className="logOut-btn">
                                Log In 👥
                            </button>
                        </Link>
                    )}
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
                {/* SEARCH BAR - Mobile (Comentada para mantener consistencia) */}
                {/*
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
                */}

                {/* NAVIGATION - Mobile */}
                <nav className="mobile-nav">
                    <Link to="/players" className="mobile-nav-link" onClick={toggleMenu}>Explore</Link>
                    <Link to="/dashboard" className="mobile-nav-link" onClick={toggleMenu}>My Team</Link>
                    <Link to="/cart" className="mobile-nav-link" onClick={toggleMenu}>
                        Cart ({cartItemsCount})
                    </Link>
                </nav>

                {/* USER ACTIONS - Mobile */}
                <div className="mobile-join">
                    {isAuthenticated ? (
                        <button className="logOut-btn mobile-join-btn" onClick={handleLogout}>
                            Log Out 👥
                        </button>
                    ) : (
                        <Link to="/login" onClick={toggleMenu}>
                            <button className="logOut-btn mobile-join-btn">
                                Log In 👥
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* OVERLAY para cerrar el menú */}
            {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
        </header>
    );
};

export default Header;