// Import Link from react-router-dom
import { Link, useLocation } from 'react-router-dom';

export default function SidebarMenu() {
    const location = useLocation(); // Get the current location

    // Function to check if the current path is part of the Users section
    const isUsersRoute = location.pathname.startsWith('/admin/users');

    return (
        <div className="card border-0 rounded shadow-sm">
            <div className="card-header">MAIN MENU</div>
            <div className="card-body">
                <div className="list-group">
                    <Link 
                        to="/admin/dashboard" 
                        className={`list-group-item list-group-item-action ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                        style={location.pathname === '/admin/dashboard' ? { backgroundColor: 'black', color: 'white' } : {}}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/admin/documents" 
                        className={`list-group-item list-group-item-action ${location.pathname === '/admin/documents' ? 'active' : ''}`}
                        style={location.pathname === '/admin/documents' ? { backgroundColor: 'black', color: 'white' } : {}}
                    >
                        Document
                    </Link>
                    <Link 
                        to="/admin/users" 
                        className={`list-group-item list-group-item-action ${isUsersRoute ? 'active' : ''}`}
                        style={isUsersRoute ? { backgroundColor: 'black', color: 'white' } : {}}
                    >
                        Users
                    </Link>
                </div>
            </div>
        </div>
    );
}
