import React from 'react';
import Header from '../components/Header';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fuera del contenedor limitado */}
      <Header />
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">Página de Login (En Construcción)</h1>
      </div>
    </div>
  );
};

export default LoginPage;
