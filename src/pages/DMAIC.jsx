import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import IsIsNotCard from '../components/IsIsNot';
import FloatingButton from '../components/FloatingButton';
import RichTextCard from '../components/RichTextCard';

const DMAIC = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'IS_IS_NOT',
      data: {
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
    },
    {
      id: 2,
      type: 'RICH_TEXT',
      data: { content: "<p>Texto inicial</p>" },
    },
  ]);

  // Función para añadir una nueva tarjeta
  const handleAddCard = (type) => {
    const newId = Date.now(); // ID único
    let newCard;

    if (type === 'IS_IS_NOT') {
      newCard = {
        id: newId,
        type: 'IS_IS_NOT',
        data: {
          title: "",
          is: { what: "", where: "", when: "", who: "", howMuch: "" },
          isNot: { what: "", where: "", when: "", who: "", howMuch: "" },
          editionMode: true, // Arranca en edición
        },
      };
    } else if (type === 'RICH_TEXT') {
      newCard = {
        id: newId,
        type: 'RICH_TEXT',
        data: {
          content: "<p>Texto nuevo</p>",
          editionMode: true, // Arranca en edición
        },
      };
    }

    setCards([...cards, newCard]);
  };


  // Función para eliminar una tarjeta
  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  // Función para actualizar una tarjeta (al guardar cambios)
  const handleSaveCard = (id, newData) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, data: newData } : card))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <Header title="Hacer cada fase monocromatica" />

      {/* Render de todas las cards */}
      {cards.map((card) => {
        switch (card.type) {
          case 'IS_IS_NOT':
            return (
              <IsIsNotCard
                key={card.id}
                data={card.data}
                onDelete={() => handleDeleteCard(card.id)}
                onSave={(newData) => handleSaveCard(card.id, newData)}
              />
            );
          case 'RICH_TEXT':
            return (
              <RichTextCard
                key={card.id}
                initialValue={card.data}
                onDelete={() => handleDeleteCard(card.id)}
                onSave={(newContent) =>
                  handleSaveCard(card.id, { content: newContent })
                }
              />
            );
          default:
            return null;
        }
      })}

      {/* Botón para añadir nuevas tarjetas */}
      <FloatingButton
        addIsIsNot={() => handleAddCard('IS_IS_NOT')}
        addRichText={() => handleAddCard('RICH_TEXT')}
      />

      <Footer />
    </div>
  );
};

export default DMAIC;

