import React from 'react';

const Benefits = () => {
  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-screen-lg mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Beneficios Clave</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow-lg rounded-md text-center">
            <h3 className="font-semibold text-xl">Metodologías Estructuradas</h3>
            <p className="mt-2 text-gray-600">Optimiza tus procesos con DMAIC y más.</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-md text-center">
            <h3 className="font-semibold text-xl">Colaboración Eficiente</h3>
            <p className="mt-2 text-gray-600">Roles claros para todo tu equipo.</p>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-md text-center">
            <h3 className="font-semibold text-xl">Resultados Medibles</h3>
            <p className="mt-2 text-gray-600">Visualiza y comparte tus KPIs.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
