import React from 'react';
import Header from '../components/Header';
import Benefits from '../components/Benefits';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';


const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fuera del contenedor limitado */}
      <Header title="Solvit" />

      {/* Contenido limitado con max-width */}
      <div className="flex-grow max-w-7xl mx-auto bg-white px-4 sm:px-6 lg:px-8 pt-20">
        <main className="py-8">
          <Benefits />
          <CallToAction />
        </main>
      </div>

      {/* Footer fuera del contenedor limitado */}
      <Footer />
    </div>
  );
};

export default LandingPage;


