import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleHeaderClick = () => {
    // Si el usuario está autenticado, redirige a /main. Si no, redirige a /
    navigate(isAuthenticated ? '/main' : '/');
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* H1 clicable para redirigir según autenticación */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={handleHeaderClick}
        >
          {title}
        </h1>

        {/* Navegación */}
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link to="/main" className="text-white hover:text-white hover:underline">Home</Link></li>
            <li><Link to="/projects" className="text-white hover:text-white hover:underline">Projects</Link></li>
            <li><Link to="/settings" className="text-white hover:text-white hover:underline">Settings</Link></li>
            <li>
              <button
                onClick={() => navigate('/')}
                className="hover:underline text-red-400"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;

