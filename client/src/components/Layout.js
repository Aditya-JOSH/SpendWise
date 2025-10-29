import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  List, 
  Tag, 
  Settings, 
  Menu, 
  X,
  TrendingUp,
  DollarSign,
  LogOut,
  User
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Budgets', href: '/budgets', icon: Wallet },
    { name: 'Transactions', href: '/transactions', icon: List },
    { name: 'Categories', href: '/categories', icon: Tag },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <DollarSign className="logo-icon" />
            <span className="logo-text">SpendWise</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive(item.href) ? 'nav-item-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <ThemeToggle />
          <Link
            key='userGuide'
            to='/user-guide'
            className='nav-item'
            onClick={() => setSidebarOpen(false)}
          >
            <span>Docs</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <header className="top-bar">
          <button 
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="top-bar-right">
            <div className="user-menu" ref={userMenuRef}>
              <div 
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span>{user?.name?.charAt(0) || 'U'}</span>
              </div>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <span className="user-name">{user?.name || 'User'}</span>
                    <span className="user-email">{user?.email || 'user@example.com'}</span>
                  </div>
                  <div className="user-menu-items">
                    <button className="user-menu-item">
                      <User size={16} />
                      Profile Settings
                    </button>
                    <button className="user-menu-item">
                      <Settings size={16} />
                      Preferences
                    </button>
                    <hr className="user-menu-divider" />
                    <button className="user-menu-item logout-btn" onClick={handleLogout}>
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
