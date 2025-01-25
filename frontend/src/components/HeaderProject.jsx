import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';

const HeaderProject = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Sección izquierda: título y botón */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <button
            className="bg-white text-blue-600 px-3 py-1 rounded-lg flex items-center shadow hover:bg-gray-100 hover:shadow-md transition duration-200"
            onClick={() => navigate('/newProject')}
            aria-label="Crear un nuevo proyecto"
          >
            <span className="text-lg font-bold">+</span>
            <span className="ml-2 text-sm">Nuevo Proyecto</span>
          </button>
        </div>
        {/* Sección de navegación */}
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/main" className="text-textWhite hover:underline hover:text-white">Home</Link></li>
            <li><Link to="/projects" className="text-textWhite hover:underline hover:text-white">Projects</Link></li>
            <li><Link to="/settings" className="text-textWhite hover:underline hover:text-white">Settings</Link></li>
            <li><Link to="/" className="hover:underline hover:text-red-500 text-red-400">Logout</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

HeaderProject.propTypes = {
  title: PropTypes.string.isRequired
};

export default HeaderProject;
