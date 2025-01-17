import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import IsIsNotCard from '../components/IsIsNot';
import FloatingButton from '../components/FloatingButton';

const DMAIC = () => {
  const [isIsNotList, setIsIsNotList] = useState([
    {
        id: 1,
        title: "IS / IS NOT 1",
        is: {
          what: "Falla técnica en el sistema",
          where: "En el almacén principal",
          when: "Durante los fines de semana",
          who: "Operadores del turno nocturno",
          howMuch: "Impacta en un 20% los costos",
        },
        isNot: {
          what: "No es un problema de hardware",
          where: "No ocurre en los almacenes secundarios",
          when: "No ocurre durante días laborables",
          who: "No afecta al equipo de administración",
          howMuch: "No impacta las métricas de calidad",
        },
      },
      {
        id: 2,
        title: "IS / IS NOT 2",
        is: {
          what: "Falla técnica en el sistema",
          where: "En el almacén principal",
          when: "Durante los fines de semana",
          who: "Operadores del turno nocturno",
          howMuch: "Impacta en un 20% los costos",
        },
        isNot: {
          what: "No es un problema de hardware",
          where: "No ocurre en los almacenes secundarios",
          when: "No ocurre durante días laborables",
          who: "No afecta al equipo de administración",
          howMuch: "No impacta las métricas de calidad",
        },
      },
  ]);

  // Esta función creará un nuevo objeto vacío para Is/Is Not
  // y lo añade al array para que se renderice una nueva card
  const handleAddIsIsNot = () => {
    const newId = Date.now(); // Por simplicidad, puedes usar Date.now(), un uuid, etc.
    const newCard = {
      id: newId,
      title: "", // Título vacío de inicio
      // Puedes añadir un campo problemStatement si lo manejas en tu card
      // problemStatement: "",
      is: {
        what: "",
        where: "",
        when: "",
        who: "",
        howMuch: "",
      },
      isNot: {
        what: "",
        where: "",
        when: "",
        who: "",
        howMuch: "",
      },
      editionMode: true, // <-- clave para que abra en modo edición
    };

    setIsIsNotList([...isIsNotList, newCard]);
  };

  //Función para eliminar una card
  const handleDeleteCard = (id) => {
    setIsIsNotList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <Header title="Project Name" />

      {/* Render de todas las cards */}
      {isIsNotList.map((item) => (
        <IsIsNotCard key={item.id} data={item} onDelete={handleDeleteCard} />
      ))}
      {/* Botón para añadir nuevo Is/IsNot */}
      <FloatingButton addIsIsNot={handleAddIsIsNot}/>

      <Footer />
    </div>
  );
};

export default DMAIC;
