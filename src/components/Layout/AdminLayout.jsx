import { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  CubeIcon,
  ChartBarIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../Breadcrumbs';
import Footer from '../Footer/Footer';
import { UserContext } from '../Context/User.Context';


export default function AdminLayout() {
  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/admin-login');
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest('aside') &&
        !event.target.closest('button')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Admin Dashboard', link: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Fixed Sidebar Toggle Button */}
      <button
        onClick={() =>
          isMobile ? setIsMobileMenuOpen(!isMobileMenuOpen) : setIsSidebarOpen(!isSidebarOpen)
        }
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-700 hover:text-black focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        {(isMobile && isMobileMenuOpen) || (!isMobile && isSidebarOpen) ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Top Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none">
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-700">Admin User</span>
              <Link to='/admin-login' className="text-primary-600 hover:underline" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:relative w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${isMobile ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') :
              (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')} 
            z-40`}
        >
          <nav className="p-5 space-y-5">
            <Link
              to="/admin"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ChartBarIcon className="w-5 h-5 mr-2" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/vendors"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserGroupIcon className="w-5 h-5 mr-2" />
              <span>Vendor Management</span>
            </Link>
            <Link
              to="/admin/products"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CubeIcon className="w-5 h-5 mr-2" />
              <span>Product Approvals</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-6 bg-gray-50 overflow-x-hidden transition-all duration-300 ${isMobile && isMobileMenuOpen ? 'ml-0' : 'md:ml-0'
            }`}
        >
          <Breadcrumbs items={breadcrumbItems} />
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
