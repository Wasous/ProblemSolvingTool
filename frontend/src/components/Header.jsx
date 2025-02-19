import { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Menu icons as components
const MenuIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

import DmaicMenu from './DmaicMenu.jsx';

const Header = ({ title, currentStage, setCurrentStage, dmaicStages }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const params = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if we're on a DMAIC page by either route path or projectId param
  const isDmaicPage = location.pathname.includes('/DMAIC') || params.projectId;
  // Determine if we're looking at a specific project
  const isSpecificProject = Boolean(params.projectId);

  const handleHeaderClick = () => {
    navigate(isAuthenticated ? '/main' : '/');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLinks = ({ className = "", onClick = () => {} }) => (
    <ul className={`${className}`}>
      {isAuthenticated ? (
        <>
          <li>
            <Link 
              to="/main" 
              className="block py-2 text-gray-300 hover:text-white transition-colors"
              onClick={onClick}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/projects" 
              className="block py-2 hover:text-gray-200 transition-colors"
              onClick={onClick}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className="block py-2 hover:text-gray-200 transition-colors"
              onClick={onClick}
            >
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                handleLogoutClick();
                onClick();
              }}
              className="block w-full text-left py-2 text-rose-400 hover:text-rose-300 transition-colors"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link 
              to="/login" 
              className="block py-2 hover:text-gray-200 transition-colors"
              onClick={onClick}
            >
              Login
            </Link>
          </li>
          <li>
            <Link 
              to="/register" 
              className="block py-2 hover:text-gray-200 transition-colors"
              onClick={onClick}
            >
              Register
            </Link>
          </li>
        </>
      )}
    </ul>
  );

  return (
    <header className="bg-slate-800 text-gray-100 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <h1
              className="text-xl lg:text-2xl font-bold cursor-pointer truncate max-w-[200px] lg:max-w-none hover:text-white transition-colors"
              onClick={handleHeaderClick}
            >
              {title}
            </h1>

            {/* New Project Button - Hidden on mobile */}
            {!isDmaicPage && isAuthenticated && (
              <button
                className="hidden lg:flex bg-indigo-600 text-white px-4 py-2 rounded-lg items-center shadow-md hover:bg-indigo-700 transition duration-200"
                onClick={() => navigate('/newProject')}
                aria-label="Create new project"
              >
                <span className="text-lg font-bold">+</span>
                <span className="ml-2 text-sm">Nuevo Proyecto</span>
              </button>
            )}
          </div>

          {/* DMAIC Menu - Show only on DMAIC pages with stages data */}
          {isDmaicPage && dmaicStages && dmaicStages.length > 0 && currentStage && setCurrentStage && (
            <div className="hidden lg:block">
              <DmaicMenu
                stages={dmaicStages}
                currentStage={currentStage}
                setCurrentStage={setCurrentStage}
              />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <NavLinks className="flex space-x-6 items-center" />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-slate-700 bg-slate-500 rounded-lg transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-700">
            {/* Mobile New Project Button */}
            {!isDmaicPage && isAuthenticated && (
              <button
                className="w-full mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-md hover:bg-indigo-700 transition duration-200"
                onClick={() => {
                  navigate('/newProject');
                  setIsMenuOpen(false);
                }}
              >
                <span className="text-lg font-bold">+</span>
                <span className="ml-2">New Project</span>
              </button>
            )}

            {/* Mobile DMAIC Menu */}
            {isDmaicPage && dmaicStages && dmaicStages.length > 0 && currentStage && setCurrentStage && (
              <div className="mb-4">
                <DmaicMenu
                  stages={dmaicStages}
                  currentStage={currentStage}
                  setCurrentStage={setCurrentStage}
                />
              </div>
            )}

            {/* Mobile Navigation Links */}
            <NavLinks 
              className="space-y-2" 
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;