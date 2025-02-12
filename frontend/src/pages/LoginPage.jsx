import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext.jsx';
import { login as apiLogin } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Función del contexto para actualizar el estado de autenticación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken, userId, userName } = await apiLogin(email, password);

      // Guardamos el access token en el estado global o en memoria
      login(accessToken, userId, userName); // 💡 Login lo guarda en el contexto.

      // Redirige al usuario al dashboard
      navigate('/main');
    } catch (error) {
      console.error('Error en el login:', error.response || error);
      alert('Credenciales incorrectas o error en el servidor.');
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header title="Solvit" />

      {/* Contenedor del Formulario */}
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-6 sm:py-12">
        <div className="relative p-3 w-full mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative bg-white shadow-lg rounded-lg p-8 w-full">
            <h1 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de Email */}
              <div className="relative">
                <input
                  autoComplete="on"
                  type="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  required
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                  placeholder="Correo Electrónico"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Correo Electrónico
                </label>
              </div>

              {/* Campo de Contraseña */}
              <div className="relative">
                <input
                  autoComplete="on"
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  required
                  className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                  placeholder="Contraseña"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Contraseña
                </label>
              </div>

              {/* Botón de Iniciar Sesión */}
              <div className="relative">
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md px-4 py-2 w-full hover:bg-blue-600"
                >
                  Iniciar Sesión
                </button>
              </div>
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
