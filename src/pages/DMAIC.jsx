import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import IsIsNotCard from '../components/IsIsNot';
import FloatingButton from '../components/FloatingButton';
import RichTextCard from '../components/RichTextCard';

const DMAIC = () => {
  // Estado del stage actual
  const [currentStage, setCurrentStage] = useState('Define');

  // Stages DMAIC con sus estados
  const dmaicStages = [
    { name: 'Define', started: true, completed: true },
    { name: 'Measure', started: true, completed: true },
    { name: 'Analyze', started: true, completed: false },
    { name: 'Improve', started: false, completed: false },
    { name: 'Control', started: false, completed: false },
  ];

  const [defineCards, setDefineCards] = useState([
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

  const [measureCards, setMeasureCards] = useState([]);
  const [analyzeCards, setAnalyzeCards] = useState([]);
  const [improveCards, setImproveCards] = useState([]);
  const [controlCards, setControlCards] = useState([]);
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
          title: "",
          content: "<p>Texto nuevo</p>",
          editionMode: true, // Arranca en edición
        },
      };
    }

    // Actualizar el array correspondiente al currentStage
    switch (currentStage) {
      case 'Define':
        setDefineCards([...defineCards, newCard]);
        break;
      case 'Measure':
        setMeasureCards([...measureCards, newCard]);
        break;
      case 'Analyze':
        setAnalyzeCards([...analyzeCards, newCard]);
        break;
      case 'Improve':
        setImproveCards([...improveCards, newCard]);
        break;
      case 'Control':
        setControlCards([...controlCards, newCard]);
        break;
      default:
        console.error(`Stage desconocido: ${currentStage}`);
    }
  };


  // Función para eliminar una tarjeta
  const handleDeleteCard = (id) => {
    const cardHandlers = {
      Define: setDefineCards,
      Measure: setMeasureCards,
      Analyze: setAnalyzeCards,
      Improve: setImproveCards,
      Control: setControlCards,
    };

    // Si el currentStage tiene un handler, aplícalo
    cardHandlers[currentStage]?.((prev) => prev.filter((card) => card.id !== id));

    // Si no existe el currentStage, muestra un error
    if (!cardHandlers[currentStage]) {
      console.error(`Stage desconocido: ${currentStage}`);
    }
  };

  // Función para actualizar una tarjeta (al guardar cambios)
  const handleSaveCard = (id, newData) => {
    setDefineCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, data: newData } : card))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <Header
        title="Hacer cada fase monocromatica"
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        dmaicStages={dmaicStages} />

      {(() => {
        switch (currentStage) {
          case 'Define':
            return (
              <>
                {/* Render de todas las cards de Define */}
                {defineCards.map((card) => {
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
              </>
            );

          case 'Measure':
            return (
              <>
                {/* Render de todas las cards de Measure */}
                {measureCards.map((card) => {
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
              </>
            );

          // Casos adicionales (Analyze, Improve, Control) pueden seguir la misma estructura
          case 'Analyze':
            return (
              <>
                {/* Render de todas las cards de Analyze */}
                {analyzeCards.map((card) => {
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
              </>
            );
          case 'Improve':
            return (
              <>
                {/* Render de todas las cards de Analyze */}
                {improveCards.map((card) => {
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
              </>
            );
          case 'Control':
            return (
              <>
                {/* Render de todas las cards de Analyze */}
                {controlCards.map((card) => {
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
              </>
            );
          default:
            return <p>No encontramos nada por aquí... empieza creándolo desde "+"</p>;
        }
      })()}
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

