import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'; // Placeholder para futuras páginas
import "./styles/globals.css";
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/" element={<LandingPage />} />

        {/* Ruta para la página de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta para la página de registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Ruta para la página principal */}
        <Route path="/main" element={<MainPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
