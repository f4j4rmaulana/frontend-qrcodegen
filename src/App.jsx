import { useContext} from 'react';
import AppRoutes from './routes';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Logo from './assets/Logo-BIG-Putih.png';

export default function App() {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated, resetStates } = useContext(AuthContext);

    // State to store the logged-in user's information
    const user = (() => {
        const userData = Cookies.get('user');
        return userData ? JSON.parse(userData) : null;
    })(); // Immediately invoked function to initialize `user`

    const logout = async () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setIsAuthenticated(false);
        resetStates();
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
                            {isAuthenticated && user ? (
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle fw-bolder" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {user.name} {/* Display logged-in user's name */}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                        <li>
                                            <Link to="/change-password" className="dropdown-item">
                                                Change Password
                                            </Link>
                                        </li>
                                        <li>
                                            <a onClick={logout} style={{ cursor: 'pointer' }} className="dropdown-item">
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
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
