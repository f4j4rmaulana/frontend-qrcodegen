// Import useState dan useEffect
import { useState, useEffect } from 'react';

// Import SidebarMenu
import SidebarMenu from '../../../components/SidebarMenu';

// Import useNavigate dari react-router-dom
import { useNavigate, Link } from 'react-router-dom';

// Import js-cookie untuk mengelola cookies
import Cookies from 'js-cookie';

// Import api untuk melakukan permintaan API
import api from '../../../services/api';

// Import icons from react-icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Fungsi komponen utama untuk membuat pengguna baru
export default function UsersCreate() {

    // Mengambil token dari cookies
    const token = Cookies.get('token');

    // useNavigate hook untuk navigasi antar halaman
    const navigate = useNavigate();

    // Mendefinisikan state untuk field formulir
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [unitKerjaId, setUnitKerjaId] = useState('');

    // Mendefinisikan state untuk opsi dropdown
    const [roles, setRoles] = useState([]);
    const [unitKerjas, setUnitKerjas] = useState([]);

    // State untuk menampung pesan kesalahan validasi
    const [validation, setValidation] = useState([]);

    // State untuk mengontrol visibility password
    const [showPassword, setShowPassword] = useState(false);

    // Mengambil data roles dan unit kerja saat komponen pertama kali dimuat
    useEffect(() => {
        // Menetapkan header Authorization
        api.defaults.headers.common['Authorization'] = token;

        // Mengambil data roles dari API
        api.get('/api/admin/roles')
            .then(response => {
                setRoles(response.data.data); // Menyimpan data roles ke state
            })
            .catch(error => {
                console.error('Error fetching roles:', error); // Menampilkan error di console jika gagal
            });

        // Mengambil data unit kerja dari API
        api.get('/api/admin/unit-kerja')
            .then(response => {
                setUnitKerjas(response.data.data); // Menyimpan data unit kerja ke state
            })
            .catch(error => {
                console.error('Error fetching unit kerja:', error); // Menampilkan error di console jika gagal
            });
    }, [token]); // Menambahkan token ke dalam array dependencies

    // Fungsi untuk menyimpan data pengguna
    const storeUser = async (e) => {
        e.preventDefault(); // Mencegah perilaku default form submission

        // Mengambil ulang token dari cookies
        const token = Cookies.get('token');

        // Menetapkan header Authorization
        api.defaults.headers.common['Authorization'] = token;

        // Membuat permintaan API untuk menyimpan data pengguna baru
        await api.post('/api/admin/users', {
            name: name,
            email: email,
            password: password,
            roleId: roleId,
            unitKerjaId: unitKerjaId
        })
            .then(() => {
                // Mengarahkan ke halaman daftar pengguna
                navigate('/admin/users');
            })
            .catch(error => {
                // Menyimpan pesan kesalahan validasi ke state
                setValidation(error.response.data);
            });
    }

    return (
        <div className="container-fluid mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <SidebarMenu />
                </div>
                <div className="col-md-9">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-header">
                            ADD USER
                        </div>
                        <div className="card-body">
                            {/* Memeriksa apakah ada kesalahan validasi */}
                            {validation.errors && (
                                <div className="alert alert-danger mt-2 mb-2">
                                    {/* Menampilkan setiap kesalahan dalam daftar */}
                                    <ul className="mb-0 ps-3" style={{ margin: '0', paddingLeft: '15px' }}>
                                        {validation.errors.map((error, index) => (
                                            <li key={index} style={{ marginBottom: '5px' }}>{error.path} : {error.msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <form onSubmit={storeUser}>
                                <div className="form-group mb-3">
                                    <label className="mb-1 fw-bold">Full Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Full Name" />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="mb-1 fw-bold">Email address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email Address" />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="mb-1 fw-bold">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-control"
                                            placeholder="Password"
                                        />
                                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>

                                {/* Dropdown untuk memilih Role */}
                                <div className="form-group mb-3">
                                    <label className="mb-1 fw-bold">Role</label>
                                    <select className="form-control" value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
                                        <option value="">-- Select Role --</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dropdown untuk memilih Unit Kerja */}
                                <div className="form-group mb-3">
                                    <label className="mb-1 fw-bold">Unit Kerja</label>
                                    <select className="form-control" value={unitKerjaId} onChange={(e) => setUnitKerjaId(e.target.value)} required>
                                        <option value="">-- Select Unit Kerja --</option>
                                        {unitKerjas.map(unit => (
                                            <option key={unit.id} value={unit.id}>{unit.nama}</option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-sm btn-primary px-3 me-2">SAVE</button>
                                <Link 
                                    to="/admin/users" 
                                    className="btn btn-sm btn-" 
                                    style={{ textDecoration: 'none', color: 'black' }}
                                >
                                    Back
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
