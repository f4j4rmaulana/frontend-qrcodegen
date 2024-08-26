import { useState, useEffect } from 'react';
import SidebarMenu from '../../../components/SidebarMenu';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../../../services/api';

export default function UsersIndex() {
    // State for users
    const [users, setUsers] = useState([]);

    // State for error message
    const [errorMsg, setErrorMsg] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch users data with pagination
    const fetchDataUsers = async (page = 1) => {
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
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDataUsers(1);
        }, 500); // Delay search to prevent too many API calls

        return () => clearTimeout(timeoutId);
    }, [searchQuery, limit]);

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
                            {
                                errorMsg && (
                                    <div className="alert alert-danger mt-2">
                                        {errorMsg}
                                    </div>
                                )
                            }
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
                                        <th scope="col">No</th> {/* New column for numbering */}
                                        <th scope="col">Full Name</th>
                                        <th scope="col">Email Address</th>
                                        <th scope="col" style={{ width: "17%" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.length > 0
                                            ? users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{(currentPage - 1) * limit + index + 1}</td> {/* Row number */}
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td className="text-center">
                                                        <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</Link>
                                                        <button
                                                            className="btn btn-sm btn-danger rounded-sm shadow border-0"
                                                            onClick={() => deleteUser(user.id)}
                                                        >
                                                            DELETE
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan="4" className="text-center"> {/* Updated colspan to 4 to match the new column */}
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
