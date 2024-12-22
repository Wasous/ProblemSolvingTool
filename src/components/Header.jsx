import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full bg-blue-600 text-white py-4 px-6">
      <div className="max-w-screen-lg mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi App</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
