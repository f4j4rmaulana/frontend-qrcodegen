//import useState dan useEffect
import { useState, useEffect } from 'react';

//import SidebarMenu
import SidebarMenu from '../../../components/SidebarMenu';

//import js cookie
import Cookies from 'js-cookie';

//import api
import api from '../../../services/api';

export default function DocumentsIndex() {
    //ini state "documents"
    const [documents, setDocuments] = useState([]);
    const [message, setMessage] = useState(''); // State for success message
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [totalPages, setTotalPages] = useState(1); // State for total pages
    const [limit, setLimit] = useState(10); // State for limit of documents per page

    //define method "fetchDataDocuments"
    const fetchDataDocuments = async (page = 1) => {
        //get token from cookies inside the function to ensure it's up-to-date
        const token = Cookies.get('token');
        console.log(token);

        if (token) {
            //set authorization header with token
            api.defaults.headers.common['Authorization'] = token;

            //fetch data from API with Axios
            try {
                const response = await api.get(`/api/admin/documents?page=${page}&limit=${limit}`);
                //assign response data to state "documents"
                setDocuments(response.data.data);
                setCurrentPage(response.data.currentPage); // assuming your backend sends current page
                setTotalPages(response.data.totalPages); // assuming your backend sends total pages
            } catch (error) {
                console.error('There was an error fetching the document!', error);
            }
        } else {
            console.error('Token is not available!');
        }
    };

    //run hook useEffect
    useEffect(() => {
        //call method "fetchDataDocuments"
        fetchDataDocuments();
    }, [limit]);

    //define method "deleteDocument"
    const deleteDocument = async (id) => {
        // Show confirmation dialog
        const confirmed = window.confirm('Are you sure you want to delete this document?');

        if (!confirmed) {
            return;
        }

        //get token from cookies inside the function to ensure it's up-to-date
        const token = Cookies.get('token');

        if (token) {
            //set authorization header with token
            api.defaults.headers.common['Authorization'] = token;

            try {
                //fetch data from API with Axios
                await api.delete(`/api/admin/documents/${id}`);

                //call method "fetchDataDocuments"
                fetchDataDocuments(currentPage);

                //set success message
                setMessage('Document deleted successfully');

                //clear message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('There was an error deleting the document!', error);
            }
        } else {
            console.error('Token is not available!');
        }
    };

    //define method to handle page change
    const handlePageChange = (page) => {
        fetchDataDocuments(page);
    };

    //define method to handle limit change
    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
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
                            <div className="mb-3">
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
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead className="bg-dark text-white">
                                        <tr>
                                            <th scope="col">Original File Name</th>
                                            <th scope="col">Barcode File Name</th>
                                            <th scope="col">Original File Path</th>
                                            <th scope="col">Barcode File Path</th>
                                            <th scope="col">Created By</th>
                                            <th scope="col" style={{ width: '17%' }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.length > 0 ? (
                                            documents.map((document, index) => (
                                                <tr key={index}>
                                                    <td>{document.originalFileName}</td>
                                                    <td>{document.barcodeFileName}</td>
                                                    <td>
                                                        <a href={'http://192.168.210.103/archive/' + document.originalFilePath} target="_blank" rel="noopener noreferrer">
                                                            Link
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <a href={'http://192.168.210.103/archive/' + document.path} target="_blank" rel="noopener noreferrer">
                                                            Link
                                                        </a>
                                                    </td>
                                                    <td>{document.userName}</td>
                                                    <td className="text-center">
                                                        <button onClick={() => deleteDocument(document.id)} className="btn btn-sm btn-danger rounded-sm shadow border-0">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    <div className="alert alert-danger mb-0">Data Belum Tersedia!</div>
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
