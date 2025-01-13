import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import IsIsNotCard from '../components/IsIsNot';

const DMAIC = () => {
// Datos de ejemplo
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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
            <Header title="Project Name" />

            {/* Main Content */}
            {isIsNotList.map((item) => (
                    <IsIsNotCard key={item.id} data={item} />
                ))}
                
            <Footer />
        </div>
    );
};

export default DMAIC;
