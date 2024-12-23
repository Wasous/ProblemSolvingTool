import React from 'react';

const Header = () => (
  <header className="bg-blue-600 text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">MyApp Dashboard</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">Projects</a></li>
          <li><a href="#" className="hover:underline">Settings</a></li>
          <li><a href="#" className="hover:underline text-red-400">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white p-4 mt-6">
    <div className="container mx-auto text-center">
      <p>&copy; 2024 MyApp. All rights reserved.</p>
    </div>
  </footer>
);

const Card = ({ title, description, bgColor }) => (
  <div className={`p-4 rounded-lg shadow ${bgColor}`}>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

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