// Import useState, useEffect, dan useCallback
import { useState, useEffect, useCallback } from 'react';

// Import SidebarMenu
import SidebarMenu from '../../../components/SidebarMenu';

// Import useNavigate, useParams, dan Link dari react-router-dom
import { useNavigate, useParams, Link } from 'react-router-dom';

// Import js-cookie untuk mengelola cookies
import Cookies from 'js-cookie';

// Import api untuk melakukan permintaan API
import api from '../../../services/api';

// Import icons from react-icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Fungsi komponen utama untuk mengedit pengguna
export default function UsersEdit() {

    // Mengambil token dari cookies
    const token = Cookies.get('token');

    // useNavigate hook untuk navigasi antar halaman
    const navigate = useNavigate();

    // Mengambil parameter id dari URL
    const { id } = useParams();

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

    // Fungsi untuk mengambil detail pengguna berdasarkan ID
    const fetchDetailUser = useCallback(async () => {
        // Menetapkan header Authorization
        api.defaults.headers.common['Authorization'] = token;

        // Mengambil data pengguna dari API
        await api.get(`/api/admin/users/${id}`)
            .then(response => {
                // Menyimpan data pengguna ke state
                setName(response.data.data.name);
                setEmail(response.data.data.email);
                setRoleId(response.data.data.role.id);
                setUnitKerjaId(response.data.data.unitKerja.id);
                //console.log(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching user details:', error); // Menampilkan error di console jika gagal
            });
    }, [id, token]); // Menambahkan id dan token ke dalam array dependencies


    // Fungsi untuk mengambil data roles dan unit kerja dari API
    const fetchRolesAndUnits = useCallback(async () => {
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

    // Hook useEffect untuk mengambil detail pengguna dan data roles/unit kerja saat komponen pertama kali dimuat
    useEffect(() => {
        fetchDetailUser(); // Memanggil fungsi fetchDetailUser
        fetchRolesAndUnits(); // Memanggil fungsi fetchRolesAndUnits
    }, [fetchDetailUser, fetchRolesAndUnits]); // Menambahkan fungsi ke dalam array dependencies

    // Fungsi untuk memperbarui data pengguna
    const updateUser = async (e) => {
        e.preventDefault(); // Mencegah perilaku default form submission

        // Menetapkan header Authorization
        api.defaults.headers.common['Authorization'] = token;

        // Membuat permintaan API untuk memperbarui data pengguna
        await api.put(`/api/admin/users/${id}`, {
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
    };

    return (
        <div className="container-fluid mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <SidebarMenu />
                </div>
                <div className="col-md-9">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-header">
                            EDIT USER
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
                            <form onSubmit={updateUser}>
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
                                    <select 
                                        className="form-control" 
                                        value={roleId} 
                                        onChange={(e) => setRoleId(e.target.value)} 
                                        required
                                    >
                                        <option value="">-- Select Role --</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dropdown untuk memilih Unit Kerja */}
                                <div className="form-group mb-3">
                                    <label className="mb-1 fw-bold">Unit Kerja</label>
                                    <select 
                                        className="form-control" 
                                        value={unitKerjaId} 
                                        onChange={(e) => setUnitKerjaId(e.target.value)} 
                                        required
                                    >
                                        <option value="">-- Select Unit Kerja --</option>
                                        {unitKerjas.map(unit => (
                                            <option key={unit.id} value={unit.id}>{unit.nama}</option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="btn btn-sm btn-primary px-3 me-2">UPDATE</button>
                                <Link 
                                    to="/admin/users" 
                                    className="btn btn-sm btn-link" 
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
