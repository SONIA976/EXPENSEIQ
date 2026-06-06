import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { LuLayoutDashboard, LuTrendingUp, LuTrendingDown } from 'react-icons/lu';

const SideMenu = ({ activeMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useContext(UserContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LuLayoutDashboard /> },
    { name: 'Income', path: '/income', icon: <LuTrendingUp /> },
    { name: 'Expense', path: '/expense', icon: <LuTrendingDown /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearUser();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      <div className="w-64 bg-theme-card shadow-sm border-r border-theme-border min-h-screen flex flex-col transition-colors duration-200">
        {/* App Header with Logo */}
        <div className="p-6 border-b border-theme-border">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="white"/>
                <path d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V12Z" fill="#8B5CF6"/>
                <path d="M24 14H26C27.1046 14 28 14.8954 28 16V16C28 17.1046 27.1046 18 26 18H24V14Z" fill="#8B5CF6"/>
                <path d="M6 20L10 16L14 18L18 12L22 14L26 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="16" y="19" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold">₹</text>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-theme-main">ExpenseIQ</h3>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-theme-border">
          <div className="flex items-center space-x-4 mb-6">
            {user?.profilePhoto ? (
              <img 
                src={user.profilePhoto} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover border-3 border-purple-200 shadow-md"
                onError={(e) => {
                  console.error('Failed to load profile image:', user.profilePhoto);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-3 border-purple-200 shadow-md">
                <span className="text-purple-600 font-semibold text-2xl">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-theme-main truncate">
                {user?.fullName || 'User'}
              </h3>
              <p className="text-xs text-theme-muted truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          
          <button
            onClick={confirmLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-6">
          <h2 className="text-lg font-semibold text-theme-main mb-6">Menu</h2>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600'
                    : 'text-theme-muted hover:bg-theme-bg hover:text-theme-main'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Confirm Logout</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You will need to sign in again to access your account.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SideMenu
