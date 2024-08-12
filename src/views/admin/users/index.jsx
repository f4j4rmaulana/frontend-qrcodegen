import { useState, useEffect } from 'react';

//import SidebarMenu
import SidebarMenu from '../../../components/SidebarMenu';

//import Link
import { Link } from 'react-router-dom';

//import js cookie
import Cookies from 'js-cookie';

//import api
import api from '../../../services/api';

export default function UsersIndex() {
    // State for users
    const [users, setUsers] = useState([]);

    // State for error message
    const [errorMsg, setErrorMsg] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [totalPages, setTotalPages] = useState(1); // State for total pages
    const [limit, setLimit] = useState(10); // State for limit of documents per page

    // Fetch users data with pagination
    const fetchDataUsers = async (page = 1) => {
        // Get token from cookies inside the function to ensure it's up-to-date
        const token = Cookies.get('token');

        if (token) {
            // Set authorization header with token
            api.defaults.headers.common['Authorization'] = token;

            try {
                // Fetch data from API with Axios, including pagination parameters
                const response = await api.get(`/api/admin/users?page=${page}&limit=${limit}`);

                // Assign response data to state "users"
                setUsers(response.data.data);
                setCurrentPage(response.data.currentPage); // assuming your backend sends current page, fallback to page
                setTotalPages(response.data.totalPages);

            } catch (error) {
                console.error("There was an error fetching the users!", error);
                setErrorMsg(error.response?.data?.message || 'An error occurred while fetching users.');
            }
        } else {
            console.error("Token is not available!");
        }
    };

    // Run hook useEffect to fetch users on component mount and when currentPage or limit changes
    useEffect(() => {
        fetchDataUsers();
    }, [limit]);


    // Define method "deleteUser"
    const deleteUser = async (id) => {
        // Get token from cookies inside the function to ensure it's up-to-date
        const token = Cookies.get('token');

        if (token) {
            // Set authorization header with token
            api.defaults.headers.common['Authorization'] = token;

            try {
                // Delete user by ID
                await api.delete(`/api/admin/users/${id}`);

                // Refresh user list after deletion
                fetchDataUsers(currentPage);

                alert("User deleted successfully");

            } catch (error) {
                // Assign error message to state errorMsg
                setErrorMsg(error.response?.data?.message || 'An error occurred while deleting the user.');
            }
        } else {
            console.error("Token is not available!");
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
      fetchDataUsers(page);
  };

    // Handle limit change
    const handleLimitChange = (event) => {
      const newLimit = parseInt(event.target.value);
      setLimit(newLimit);
      setCurrentPage(1); // Reset to first page when limit changes
      fetchDataUsers(1); // Fetch first page of users with new limit
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
                            <div className="mb-3">
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
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
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
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td className="text-center">
                                                        <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</Link>
                                                        <button 
                                                            className="btn btn-sm btn-danger rounded-sm shadow border-0" 
                                                            onClick={() => {
                                                                if (window.confirm("Are you sure you want to delete this user?")) {
                                                                    deleteUser(user.id);
                                                                }
                                                            }}
                                                        >
                                                            DELETE
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan="3" className="text-center">
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
    )
}
