// Import dependensi yang diperlukan
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SidebarMenu from '../../../components/SidebarMenu';

// Definisikan komponen Dashboard
export default function Dashboard() {
  // Ambil token dan user dari cookies
  const token = Cookies.get('token');
  const user = JSON.parse(Cookies.get('user') || '{}'); // Ambil informasi pengguna dari cookie

  // State untuk file yang diupload, pesan, statistik, dan total upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState([]);
  const [totalUploads, setTotalUploads] = useState(0);

  // Fungsi untuk menangani perubahan file (saat file diupload)
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Simpan file yang dipilih ke dalam state
  };

  // Fungsi untuk menangani pengiriman form upload
  const handleUpload = async (e) => {
    e.preventDefault(); // Mencegah perilaku default form submit

    if (!selectedFile) { // Jika tidak ada file yang dipilih
      setMessage('Silakan pilih file untuk diupload');
      return;
    }

    // Membuat form data untuk mengirim file
    const formData = new FormData();
    formData.append('pdf', selectedFile); // Tambahkan file yang dipilih ke form data

    try {
      // Kirim permintaan POST ke server untuk upload file
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`, // Tambahkan token ke header untuk autentikasi
        },
      });

      setMessage('File berhasil diupload'); // Set pesan berhasil
      fetchStats(); // Panggil fungsi untuk mengambil statistik setelah upload berhasil
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengupload file'); // Set pesan error
      console.error('Error:', error); // Tampilkan error di console
    }
  };

  // Fungsi untuk mengambil statistik dari server
  const fetchStats = useCallback(async () => {
    try {
      // Kirim permintaan GET ke server untuk mengambil data statistik
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `${token}`, // Tambahkan token ke header untuk autentikasi
        },
      });
      setStats(response.data); // Simpan data statistik ke dalam state

      // Hitung total upload dari semua unit kerja
      const total = response.data.reduce((sum, stat) => sum + stat.jumlahUpload, 0);
      setTotalUploads(total); // Set total upload ke dalam state
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil statistik:', error); // Tampilkan error di console
    }
  }, [token]); // Tambahkan 'token' ke dalam array dependensi useCallback

  // useEffect untuk mengambil data statistik saat komponen pertama kali dimuat
  useEffect(() => {
    fetchStats(); // Panggil fungsi fetchStats
  }, [fetchStats]); // Tambahkan 'fetchStats' ke dalam array dependensi

  return (
    <div className="container-fluid mt-5 mb-5">
      <div className="row">
        {/* Sidebar Menu */}
        <div className="col-md-3">
          <SidebarMenu />
        </div>
        <div className="col-md-9">
          <div className="card border-0 rounded shadow-sm">
            <div className="card-header">DASHBOARD</div>
            <div className="card-body">
              {/* Tampilkan nama user yang sedang login */}
              <p>
                Selamat Datang, <strong>{user.name}</strong>
              </p>
              {/* Form untuk mengupload file PDF */}
              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label htmlFor="pdf">Upload PDF</label>
                  <input
                    type="file"
                    className="form-control"
                    id="pdf"
                    onChange={handleFileChange} // Panggil handleFileChange saat file dipilih
                    accept="application/pdf" // Batasi hanya file PDF yang dapat diupload
                  />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Upload
                </button>
              </form>
              {/* Tampilkan pesan jika ada */}
              {message && <p className="mt-3">{message}</p>}
              
              {/* Tabel untuk menampilkan statistik */}
              <h4 className="mt-5">Statistik</h4>
              <table className="table table-bordered mt-3">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Unit Kerja</th>
                    <th>Jumlah Upload</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat) => (
                    <tr key={stat.no}>
                      <td>{stat.no}</td>
                      <td>{stat.unitKerja}</td>
                      <td>{stat.jumlahUpload}</td>
                      <td>{stat.persentase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Tampilkan total upload */}
              <div className="mt-3">
                <h5>Total Dokumen Terupload: {totalUploads} Dokumen</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
