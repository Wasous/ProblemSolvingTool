import React from 'react';
import { Link } from 'react-router-dom';

const HeaderMain = ({ title }) => (
  <header className="bg-blue-600 text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
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
