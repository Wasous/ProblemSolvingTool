import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary w-full">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-xl font-bold text-textWhite">Mi App</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-textWhite hover:underline">Inicio</Link>
          <Link to="/login" className="text-textWhite hover:underline">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
