// Import necessary dependencies
import { useState } from 'react';
import axios from 'axios';
//import js-cookie
import Cookies from 'js-cookie';
import SidebarMenu from '../../../components/SidebarMenu';

// //get token from cookies
// const token = Cookies.get('token');

export default function Dashboard() {
    const token = Cookies.get('token');
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    console.log(token);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setMessage('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', selectedFile);

        try {
            //console.log('Sending request with token:', token); // Log token
            //console.log('FormData content:', formData.get('pdf')); // Assuming the token is stored in localStorage

            await axios.post('http://192.168.210.103:3001/api/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`,
                },
            });

            setMessage('File uploaded successfully');
            //console.log('Response:', response.data);
        } catch (error) {
            setMessage('Error uploading file');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container-fluid mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <SidebarMenu />
                </div>
                <div className="col-md-9">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-header">DASHBOARD</div>
                        <div className="card-body">
                            <p>
                                Selamat Datang, <strong></strong>
                            </p>
                            <form onSubmit={handleUpload}>
                                <div className="form-group">
                                    <label htmlFor="pdf">Upload PDF</label>
                                    <input type="file" className="form-control" id="pdf" onChange={handleFileChange} accept="application/pdf" />
                                </div>
                                <button type="submit" className="btn btn-primary mt-3">
                                    Upload
                                </button>
                            </form>
                            {message && <p className="mt-3">{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
