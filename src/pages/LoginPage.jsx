import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenedor del Formulario */}
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
          <form>
            {/* Campo de Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Campo de Contraseña */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Enlace de Registro */}
          <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
