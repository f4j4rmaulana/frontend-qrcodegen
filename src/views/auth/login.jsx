// Import hooks dari React dan React Router
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import services dan utilities
import api from '../../services/api';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext';

// Import icons from react-icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
    // Hook untuk navigasi
    const navigate = useNavigate();

    // Mengambil fungsi setIsAuthenticated dari konteks autentikasi
    const { setIsAuthenticated } = useContext(AuthContext);

    // State untuk menyimpan input form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State untuk mengontrol visibility password
    const [showPassword, setShowPassword] = useState(false);

    // State untuk menyimpan pesan error atau validasi
    const [validation, setValidation] = useState([]);
    const [errorMessage, setErrorMessage] = useState(''); // State baru untuk pesan error umum

    // Fungsi untuk menangani login
    const login = async (e) => {
        e.preventDefault(); // Mencegah reload halaman saat form di-submit

        try {
            // Panggil API untuk login
            const response = await api.post('/api/login', {
                email,
                password,
            });

            // Set token dan user cookies jika login berhasil
            Cookies.set('token', response.data.data.token);
            Cookies.set('user', JSON.stringify(response.data.data.user));

            // Set state autentikasi sebagai true
            setIsAuthenticated(true);

            // Arahkan pengguna ke halaman dashboard setelah login berhasil
            navigate('/admin/dashboard', { replace: true });
        } catch (error) {
            // Tangani error dan set error validasi
            if (error.response && error.response.data) {
                setValidation(error.response.data.errors || []); // Set error validasi jika ada
                setErrorMessage(error.response.data.message); // Set pesan error umum jika ada
            } else {
                setErrorMessage('An unexpected error occurred.'); // Error umum jika tidak ada response spesifik
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
                        {/* Menampilkan pesan error umum dan pesan error validasi jika ada */}
                        {(errorMessage || validation.length > 0) && (
                            <div className="alert alert-danger mt-2">
                                {errorMessage && <div>{errorMessage}</div>}
                                {validation.length > 0 && (
                                    <ul className="mb-0">
                                        {validation.map((error, index) => (
                                            <li key={index}>
                                                {error.path} : {error.msg}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {/* Form login */}
                        <form onSubmit={login}>
                            <div className="form-group mb-3">
                                <label className="mb-1 fw-bold">Email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Update state email saat pengguna mengetik
                                    className="form-control"
                                    placeholder="Email Address"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="mb-1 fw-bold">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} // Update state password saat pengguna mengetik
                                        className="form-control"
                                        placeholder="Password"
                                    />
                                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
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
