import React from 'react';
import { Link } from 'react-router-dom';

const HeaderMain = ({ title }) => (
  <header className="bg-blue-600 text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      {/* Sección izquierda: título y botón */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          className="bg-white text-blue-600 px-3 py-1 rounded-lg flex items-center shadow hover:bg-gray-100 hover:shadow-md transition duration-200"
          onClick={() => console.log('Nuevo proyecto creado')}
        >
          <span className="text-lg font-bold">+</span>
          <span className="ml-2 text-sm">Nuevo Proyecto</span>
        </button>
      </div>
      {/* Sección de navegación */}
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/main" className="hover:underline hover:text-textWhite text-textWhite">Home</a></li>
          <li><a href="/projects" className="hover:underline hover:text-textWhite text-textWhite">Projects</a></li>
          <li><a href="#" className="hover:underline hover:text-textWhite text-textWhite">Settings</a></li>
          <li><a href="/" className="hover:underline hover:text-red-500 text-red-400">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>
);

export default HeaderMain;