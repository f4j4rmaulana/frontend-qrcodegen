// Import hooks from React and React Router
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import services and utilities
import api from '../../services/api';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
    // Navigation hook
    const navigate = useNavigate();

    // Auth context
    const { setIsAuthenticated } = useContext(AuthContext);

    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for validation errors
    const [validation, setValidation] = useState([]);

    // Login function
    const login = async (e) => {
        e.preventDefault();

        try {
            // Call API to log in
            const response = await api.post('/api/login', {
                email,
                password,
            });

            // Set token and user cookies
            // Cookies.set('token', response.data.data.token, {
            //     sameSite: 'None',
            //     secure: window.location.protocol === 'https:', // Only set Secure if using HTTPS
            // });
            // Cookies.set('user', JSON.stringify(response.data.data.user), {
            //     sameSite: 'None',
            //     secure: window.location.protocol === 'https:', // Only set Secure if using HTTPS
            // });
            Cookies.set('token', response.data.data.token);
            Cookies.set('user', JSON.stringify(response.data.data.user));


            // Set authentication state
            setIsAuthenticated(true);

            // Redirect to dashboard
            navigate('/admin/dashboard', { replace: true });
        } catch (error) {
            // Set validation errors
            if (error.response && error.response.data) {
                setValidation(error.response.data);
            } else {
                setValidation([{ msg: 'An unexpected error occurred.' }]);
            }
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-4">
                <div className="card border-0 rounded shadow-sm">
                    <div className="card-body">
                        <h4>LOGIN</h4>
                        <hr />
                        {validation.errors && (
                            <div className="alert alert-danger mt-2 pb-0">
                                <ul>
                                    {validation.errors.map((error, index) => (
                                        <li key={index}>
                                            {error.path} : {error.msg}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <form onSubmit={login}>
                            <div className="form-group mb-3">
                                <label className="mb-1 fw-bold">Email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    placeholder="Email Address"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="mb-1 fw-bold">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                    placeholder="Password"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                LOGIN
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
