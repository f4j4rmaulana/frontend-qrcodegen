import { useContext } from 'react';

// Import router
import AppRoutes from './routes';

// Import Cookies for managing cookies
import Cookies from 'js-cookie';

// Import Link and useNavigate from react-router-dom
import { Link, useNavigate } from 'react-router-dom';

// Import context
import { AuthContext } from './context/AuthContext';

// Import logo image
import Logo from './assets/Logo-BIG-Putih.png';

export default function App() {
    // Using the `useNavigate` hook for navigation
    const navigate = useNavigate();

    // Destructure context "isAuthenticated"
    const { isAuthenticated } = useContext(AuthContext);

    // Destructure context "setIsAuthenticated"
    const { setIsAuthenticated } = useContext(AuthContext);

    // Method to handle logout
    const logout = async () => {
        // Remove token and user on cookies
        Cookies.remove('token');
        Cookies.remove('user');

        // Assign false to state "isAuthenticated"
        setIsAuthenticated(false);

        // Redirect to login
        navigate("/login", { replace: true });
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        <img src={Logo} alt="BIG Logo" style={{ height: '40px' }} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {isAuthenticated ? (
                                <li className="nav-item">
                                    <a onClick={logout} style={{ cursor: 'pointer' }} className="nav-link active" aria-current="page">
                                        Logout
                                    </a>
                                </li>
                            ) : null}
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container-fluid mt-5">
                <AppRoutes />
            </div>
        </div>
    );
}
