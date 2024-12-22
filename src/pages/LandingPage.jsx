import React from 'react';
import Header from '../components/Header';
import Benefits from '../components/Benefits';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Encabezado */}
      <Header />
      
      {/* Contenido principal */}
      <main className="flex-grow">
        <Benefits />
        <CallToAction />
      </main>
      
      {/* Pie de página */}
      <Footer />
    </div>
  );
};

export default LandingPage;
