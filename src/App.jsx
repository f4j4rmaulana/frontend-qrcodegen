//import useContext
import { useContext } from 'react';

//import router
import AppRoutes from './routes';

//import Cookies dari 'js-cookie' untuk mengelola cookies
import Cookies from 'js-cookie';

//import Link from react router dom
import { Link, useNavigate } from 'react-router-dom';

//import context
import { AuthContext } from './context/AuthContext';

export default function App() {
    // Menggunakan hook `useNavigate` untuk navigasi
    const navigate = useNavigate();

    //destructure context "isAuthenticated"
    const { isAuthenticated } = useContext(AuthContext);

    //destructure context "setIsAuthenticated"
    const { setIsAuthenticated } = useContext(AuthContext);

    // method to handle logout
    const logout = () => {
        //remove token and user on cookies
        Cookies.remove('token');
        Cookies.remove('user');

        //assign false to state "isAuthenticated"
        setIsAuthenticated(false);

        // redirect to login
        navigate('/login', { replace: true });
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        HOME
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
