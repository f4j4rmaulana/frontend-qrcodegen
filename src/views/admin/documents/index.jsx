// Import dependensi yang diperlukan
import { useState, useEffect, useCallback } from 'react';
import SidebarMenu from '../../../components/SidebarMenu';
import Cookies from 'js-cookie';
import '../../../../src/style.css';
import api from '../../../services/api';

export default function DocumentsIndex() {
    // State untuk dokumen
    const [documents, setDocuments] = useState([]);

    // State untuk pesan
    const [message, setMessage] = useState('');

    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    // Fungsi untuk mengambil data dokumen dengan pagination dan pencarian
    const fetchDataDocuments = useCallback(async (page = 1) => {
        const token = Cookies.get('token');

        if (token) {
            api.defaults.headers.common['Authorization'] = token;

            try {
                const response = await api.get(`/api/admin/documents?page=${page}&limit=${limit}&search=${searchQuery}`);
                setDocuments(response.data.data);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('There was an error fetching the documents!', error);
                setMessage(error.response?.data?.message || 'An error occurred while fetching documents.');
            }
        } else {
            console.error('Token is not available!');
        }
    }, [limit, searchQuery]); // Tambahkan 'limit' dan 'searchQuery' sebagai dependensi

    // useEffect untuk mengambil data dokumen saat komponen pertama kali dimuat atau saat 'searchQuery' atau 'limit' berubah
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDataDocuments(1);
        }, 500); // Delay search untuk mencegah terlalu banyak panggilan API

        return () => clearTimeout(timeoutId);
    }, [fetchDataDocuments]); // Tambahkan 'fetchDataDocuments' sebagai dependensi

    // Fungsi untuk menghapus dokumen
    const deleteDocument = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this document?');

        if (!confirmed) {
            return;
        }

        const token = Cookies.get('token');

        if (token) {
            api.defaults.headers.common['Authorization'] = token;

            try {
                await api.delete(`/api/admin/documents/${id}`);
                fetchDataDocuments(currentPage);
                setMessage('Document deleted successfully');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('There was an error deleting the document!', error);
                setMessage(error.response?.data?.message || 'An error occurred while deleting the document.');
                setTimeout(() => setMessage(''), 3000);
            }
        } else {
            console.error('Token is not available!');
        }
    };

    const handlePageChange = (page) => {
        fetchDataDocuments(page);
    };

    const handleLimitChange = (event) => {
        const newLimit = parseInt(event.target.value);
        setLimit(newLimit);
        setCurrentPage(1);
        fetchDataDocuments(1);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                            <span>DOCUMENT</span>
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className="alert alert-success" role="alert">
                                    {message}
                                </div>
                            )}
                            <div className="mb-3 d-flex justify-content-between">
                                <div>
                                    <label htmlFor="limit" className="form-label">
                                        Documents per page
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
                                        placeholder="Search documents..."
                                    />
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead className="bg-dark text-white">
                                        <tr>
                                            <th scope="col">No</th>
                                            <th scope="col" className="text-wrap">Original File Name</th>
                                            <th scope="col" className="text-wrap">Barcode File Name</th>
                                            <th scope="col">Original File Path</th>
                                            <th scope="col">Barcode File Path</th>
                                            <th scope="col">Created By</th>
                                            <th scope="col">Created At</th> {/* New header for createdAt */}
                                            <th scope="col" style={{ width: '17%' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.length > 0 ? (
                                            documents.map((document, index) => (
                                                <tr key={index}>
                                                    <td>{(currentPage - 1) * limit + index + 1}</td>
                                                    <td className="text-wrap">{document.originalFileName}</td>
                                                    <td className="text-wrap">{document.barcodeFileName}</td>
                                                    <td>
                                                        <a href={`${import.meta.env.VITE_BASE_URL}/archive/` + document.originalFilePath} target="_blank" rel="noopener noreferrer">
                                                            Link
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <a href={`${import.meta.env.VITE_BASE_URL}/archive/` + document.path} target="_blank" rel="noopener noreferrer">
                                                            Link
                                                        </a>
                                                    </td>
                                                    <td>{document.userName}</td>
                                                    <td>{formatDate(document.createdAt)}</td> {/* Updated row for createdAt */}
                                                    <td className="text-center">
                                                        {/* Tampilkan tombol DELETE jika pengguna memiliki izin */}
                                                        <button onClick={() => deleteDocument(document.id)} className="btn btn-sm btn-danger rounded-sm shadow border-0">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center"> {/* Updated colspan to 8 */}
                                                    <div className="alert alert-danger mb-0">No documents found matching your search criteria!</div>
                                                </td>
                                            </tr>
                                        )}
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
        </div>
    );
}
