import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Card = ({ title, description, bgColor }) => (
  <div className={`p-4 rounded-lg shadow ${bgColor}`}>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-20">
      <Header title="Solvit" isAuthenticated={true}/>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
          <p className="text-gray-700 mb-6">
            Here you can manage your projects, track your progress, and access key metrics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Cards */}
            <Card title="Projects" description="View and manage all your active projects." bgColor="bg-blue-100" />
            <Card title="Analytics" description="Check out your latest performance metrics." bgColor="bg-green-100" />
            <Card title="Resources" description="Access guides, tutorials, and documentation." bgColor="bg-yellow-100" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;