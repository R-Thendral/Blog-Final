import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200">
            BlogSphere
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="hover:text-blue-200 transition-colors font-medium"
            >
              Home
            </Link>
            
            {user && (user.role === 'author' || user.role === 'admin') && (
              <Link 
                to="/create" 
                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded transition-colors font-medium"
              >
                + Create Post
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Welcome, <span className="font-semibold">{user.username}</span>
                  {user.role && (
                    <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

