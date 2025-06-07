// IMPORTS
import { Link } from 'react-router-dom';
import './Header.css';

// COMPONENTE HEADER
const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* LOGO */}
                    <Link to="/" className="logo">
                        <div className="logo-icon">🛒⚽</div>
                        <span className="logo-text">SCOUTMARKET</span>
                    </Link>

                    {/* SEARCH BAR */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search For Name Or Position"
                            className="search-input"
                        />
                        <button className="search-btn">🔍</button>
                    </div>

                    {/* NAVIGATION */}
                    <nav className="nav">
                        <Link to="/players" className="nav-link">Buy</Link>
                        <Link to="/players" className="nav-link">Sell</Link>
                        <Link to="/players" className="nav-link">Borrowing</Link>
                        <Link to="/players" className="nav-link">Trade</Link>
                        <Link to="/dashboard" className="nav-link">My team</Link>
                    </nav>

                    {/* USER ACTIONS */}
                    <div className="user-actions">
                        <Link to="/cart" className="cart-icon">🛒</Link>
                        <Link to="/login" className="login-btn btn btn-primary">Join</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;