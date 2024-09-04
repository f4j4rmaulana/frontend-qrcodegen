// Import dependencies
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SidebarMenu from '../../../components/SidebarMenu';
import Cookies from 'js-cookie';
import api from '../../../services/api';

export default function UsersIndex() {
    const [users, setUsers] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const user = JSON.parse(Cookies.get('user') || '{}');
    const userRole = user.role ? user.role.name : '';

    const fetchDataUsers = useCallback(async (page = 1) => {
        const token = Cookies.get('token');

        if (token) {
            api.defaults.headers.common['Authorization'] = token;

            try {
                const response = await api.get(`/api/admin/users?page=${page}&limit=${limit}&search=${searchQuery}`);
                setUsers(response.data.data);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("There was an error fetching the users!", error);
                setErrorMsg(error.response?.data?.message || 'An error occurred while fetching users.');
            }
        } else {
            console.error("Token is not available!");
        }
    }, [limit, searchQuery]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDataUsers(1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [fetchDataUsers]);

    const deleteUser = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        const token = Cookies.get('token');

        if (token) {
            api.defaults.headers.common['Authorization'] = token;

            try {
                await api.delete(`/api/admin/users/${id}`);
                fetchDataUsers(currentPage);
                alert("User deleted successfully");

            } catch (error) {
                setErrorMsg(error.response?.data?.message || 'An error occurred while deleting the user.');
            }
        } else {
            console.error("Token is not available!");
        }
    };

    const handlePageChange = (page) => {
        fetchDataUsers(page);
    };

    const handleLimitChange = (event) => {
        const newLimit = parseInt(event.target.value);
        setLimit(newLimit);
        setCurrentPage(1);
        fetchDataUsers(1);
    };

    const canEditUser = (userRole, targetUserRole) => {
        if (userRole === 'Superuser') return true;
        if (userRole === 'Administrator' && targetUserRole !== 'Superuser') return true;
        return false;
    };

    const canDeleteUser = (userRole, targetUserRole) => {
        if (userRole === 'Superuser') return true;
        if (userRole === 'Administrator' && targetUserRole !== 'Superuser') return true;
        return false;
    };

    return (
        <div className="container-fluid mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <SidebarMenu />
                </div>
                <div className="col-md-9">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>USERS</span>
                            <Link to="/admin/users/create" className="btn btn-sm btn-success rounded shadow-sm border-0">ADD USER</Link>
                        </div>
                        <div className="card-body">
                            {errorMsg && (
                                <div className="alert alert-danger mt-2">
                                    {errorMsg}
                                </div>
                            )}
                            <div className="mb-3 d-flex justify-content-between">
                                <div>
                                    <label htmlFor="limit" className="form-label">
                                        Users per page
                                    </label>
                                    <select id="limit" className="form-select" value={limit} onChange={handleLimitChange}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="search" className="form-label">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        className="form-control"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search users..."
                                    />
                                </div>
                            </div>
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Full Name</th>
                                        <th scope="col">Email Address</th>
                                        <th scope="col">Unit Kerja</th>
                                        <th scope="col">Roles</th>
                                        <th scope="col" style={{ width: "17%" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {console.log(users)} */}
                                    {
                                        users.length > 0
                                            ? users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{(currentPage - 1) * limit + index + 1}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.unitKerja.nama}</td>
                                                    <td>{user.role.name}</td>
                                                    <td className="text-center">
                                                        {canEditUser(userRole, user.role.name) && (
                                                            <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</Link>
                                                        )}
                                                        {canDeleteUser(userRole, user.role.name) && (
                                                            <button
                                                                className="btn btn-sm btn-danger rounded-sm shadow border-0"
                                                                onClick={() => deleteUser(user.id)}
                                                            >
                                                                DELETE
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan="6" className="text-center">
                                                    <div className="alert alert-danger mb-0">
                                                        No Users Available!
                                                    </div>
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                            <div className="pagination d-flex align-items-center gap-1">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || totalPages === 1} className="btn btn-primary">
                                    Previous
                                </button>
                                <span>
                                    {currentPage} / {totalPages}
                                </span>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-primary">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
