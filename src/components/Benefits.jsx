import React from 'react';

const Benefits = () => {
  return (
    <section className="w-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Beneficios Clave</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 shadow-lg rounded-lg text-center">
            <h3 className="font-semibold text-xl mb-3">Metodologías Estructuradas</h3>
            <p className="text-gray-600">Optimiza tus procesos con DMAIC y más.</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg text-center">
            <h3 className="font-semibold text-xl mb-3">Colaboración Eficiente</h3>
            <p className="text-gray-600">Roles claros para todo tu equipo.</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg text-center">
            <h3 className="font-semibold text-xl mb-3">Resultados Medibles</h3>
            <p className="text-gray-600">Visualiza y comparte tus KPIs.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
