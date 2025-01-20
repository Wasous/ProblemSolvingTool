import { useState } from 'react'
import PropTypes from 'prop-types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import React from 'react';
import DmaicMenu from './DmaicMenu.jsx'

const Header = ({ title, currentStage, setCurrentStage, dmaicStages }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  console.log('Current location:', location);

  // Manejar cambio de stage
  const handleStageClick = (stage) => {
    if (stage.started) {
      setCurrentStage(stage.name);
    }
  };

  const handleHeaderClick = () => {
    navigate(isAuthenticated ? '/main' : '/');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-accentBg text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Título clicable */}
        <div className="flex items-center space-x-4">
          {/* Título fijo */}
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={handleHeaderClick}>
            {title}
          </h1>



          {/* Botón condicional basado en isAuthenticated */}
          {location.pathname !== '/DMAIC' && location.pathname !== '/newProject' && isAuthenticated && (
            <button
              className="bg-white text-blue-600 px-3 py-1 rounded-lg flex items-center shadow hover:bg-gray-100 hover:shadow-md transition duration-200"
              onClick={() => navigate('/newProject')}
              aria-label="Crear un nuevo proyecto"
            >
              <span className="text-lg font-bold">+</span>
              <span className="ml-2 text-sm">Nuevo Proyecto</span>
            </button>
          )}
        </div>
        {/* Menú DMAIC solo en la página /DMAIC */}
        {location.pathname === '/DMAIC' &&
          <DmaicMenu
            stages={dmaicStages}
            currentStage={currentStage}
            setCurrentStage={setCurrentStage} />}
        {/* Navegación Condicional */}
        <nav>
          {isAuthenticated ? (
            <ul className="flex space-x-4 items-center">
              <li><Link to="/main" className="text-white hover:text-white hover:underline">Home</Link></li>
              <li><Link to="/projects" className="text-white hover:text-white hover:underline">Projects</Link></li>
              <li><Link to="/settings" className="text-white hover:text-white hover:underline">Settings</Link></li>
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="text-red-400 hover:underline"
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex space-x-4 items-center">
              <li><Link to="/login" className="text-white hover:text-white hover:underline">Login</Link></li>
              <li><Link to="/register" className="text-white hover:text-white hover:underline">Register</Link></li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;

