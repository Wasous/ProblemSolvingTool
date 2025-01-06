import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'; // Placeholder para futuras páginas
import "./styles/globals.css";
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage'
import ProjectsPage from './pages/ProjectsPage'
import CreateProject from './pages/CreatePage';
import { AuthProvider } from './contexts/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/" element={<LandingPage />} />

        {/* Ruta para la página de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta para la página de registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Ruta para la página principal */}
        <Route path="/main" element={<MainPage />} />

        {/* Ruta para la página de projectos */}
        <Route path="/projects" element={<ProjectsPage />} />

        {/* Ruta para la página de creación de projectos */}
        <Route path="/newProject" element={<CreateProject />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
