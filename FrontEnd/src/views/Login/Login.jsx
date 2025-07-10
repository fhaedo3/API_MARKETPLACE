import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearAuthError } from '../../store/slices/authSlice';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        teamName: '',
        yearFounded: '',
        stadium: '',
        city: '',
        role: 'USER'
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar mensajes de error cuando el usuario empiece a escribir
        if (error) dispatch(clearAuthError());
        if (success) setSuccess(null);
    };

    const handleTabChange = (loginMode) => {
        setIsLogin(loginMode);
        dispatch(clearError());
        setSuccess(null);
        // Limpiar datos del formulario al cambiar de tab
        setFormData({
            username: '',
            password: '',
            email: '',
            teamName: '',
            yearFounded: '',
            stadium: '',
            city: '',
            role: 'USER'
        });
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password.trim()) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (!isLogin) {
            if (!formData.username.trim()) {
                setError('Username is required');
                return false;
            }
            if (formData.username.length < 3) {
                setError('Username must be at least 3 characters long');
                return false;
            }
            if (!formData.teamName.trim()) {
                setError('Team name is required');
                return false;
            }
            if (!formData.yearFounded || formData.yearFounded < 1800 || formData.yearFounded > new Date().getFullYear()) {
                setError('Please enter a valid year founded');
                return false;
            }
            if (!formData.stadium.trim()) {
                setError('Stadium is required');
                return false;
            }
            if (!formData.city.trim()) {
                setError('City is required');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (isLogin) {
                const loginData = {
                    email: formData.email.trim(),
                    password: formData.password
                };

                const result = await dispatch(loginUser(loginData)).unwrap();

                if (result) {
                    setSuccess('Login successful! Redirecting...');
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                }
            } else {
                const registerData = {
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    teamName: formData.teamName.trim(),
                    yearFounded: parseInt(formData.yearFounded),
                    stadium: formData.stadium.trim(),
                    city: formData.city.trim(),
                    role: formData.role
                };

                const result = await dispatch(registerUser(registerData)).unwrap();

                if (result) {
                    setSuccess('Registration successful! You can now log in.');
                    // Cambiar automáticamente a la pestaña de login después del registro exitoso
                    setTimeout(() => {
                        setIsLogin(true);
                        setFormData({
                            username: '',
                            password: '',
                            email: formData.email, // Mantener el email
                            teamName: '',
                            yearFounded: '',
                            stadium: '',
                            city: '',
                            role: 'USER'
                        });
                        setSuccess(null);
                    }, 2000);
                }
            }
        } catch (error) {
            // El error ya está manejado por Redux
            console.error('Authentication error:', error);
        }
    };

    return (
        <div className="login-page">
            <div className="containerlogin">
                <div className="auth-container">
                    <div className="auth-header">
                        <div className="logologin">
                            <img src="/images/Logo.png" alt="ScoutMarket Logo" />
                        </div>
                    </div>

                    <div className="auth-tabs">
                        <button
                            className={`tab ${isLogin ? 'active' : ''}`}
                            onClick={() => handleTabChange(true)}
                            disabled={loading}
                        >
                            Login
                        </button>
                        <button
                            className={`tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => handleTabChange(false)}
                            disabled={loading}
                        >
                            Register
                        </button>
                    </div>

                    {/* Mensajes de error y éxito */}
                    {error && (
                        <div className="message error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="message success-message">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />

                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                                <input
                                    type="text"
                                    name="teamName"
                                    placeholder="Team Name"
                                    value={formData.teamName}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                                <input
                                    type="number"
                                    name="yearFounded"
                                    placeholder="Year Founded"
                                    value={formData.yearFounded}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    required
                                />
                                <input
                                    type="text"
                                    name="stadium"
                                    placeholder="Stadium"
                                    value={formData.stadium}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    required
                                />
                            </>
                        )}

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Log In' : 'Sign Up')}
                        </button>
                    </form>

                    {isLogin && (
                        <a href="#" className="forgot-password">Forgot your password?</a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;