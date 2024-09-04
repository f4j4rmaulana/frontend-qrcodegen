import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

// Membuat context untuk menyimpan status otentikasi
export const AuthContext = createContext();

// Membuat provider otentikasi dengan menggunakan context yang telah dibuat sebelumnya
export const AuthProvider = ({ children }) => {
    // Menggunakan useState untuk menyimpan status otentikasi berdasarkan keberadaan token di cookies
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
    
    // Tambahkan state tambahan yang ingin Anda kelola
    const [roles, setRoles] = useState([]); // Contoh state tambahan
    const [unitKerjas, setUnitKerjas] = useState([]); // Contoh state tambahan

    // Menggunakan useEffect untuk memantau perubahan pada token di cookies
    useEffect(() => {
        const handleTokenChange = () => {
            setIsAuthenticated(!!Cookies.get('token'));
        };

        // Menambahkan event listener pada storage untuk memantau perubahan pada token
        window.addEventListener('storage', handleTokenChange);

        // Mengembalikan sebuah fungsi yang akan dipanggil saat komponen di-unmount untuk membersihkan event listener
        return () => {
            window.removeEventListener('storage', handleTokenChange);
        };
    }, []);

    // Fungsi untuk mereset semua state terkait autentikasi
    const resetStates = () => {
        setIsAuthenticated(false);
        setRoles([]);
        setUnitKerjas([]);
    };

    // Mengembalikan provider dengan nilai isAuthenticated, setIsAuthenticated, dan fungsi resetStates
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, roles, setRoles, unitKerjas, setUnitKerjas, resetStates }}>
            {children}
        </AuthContext.Provider>
    );
};

// Validasi prop children menggunakan prop-types
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
