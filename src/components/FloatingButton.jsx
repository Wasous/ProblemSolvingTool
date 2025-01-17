import React from 'react';
import { AiOutlinePlus, AiOutlinePhone, AiOutlineMail, AiOutlineMessage } from 'react-icons/ai';

const FloatingButton = ( {addIsIsNot} ) => {
  return (
    <div className="fixed bottom-10 right-8 group flex flex-col items-center">
      

      {/* Contenedor de Sub-Botones */}
      <div
        className="
          flex flex-col items-center
          opacity-0 group-hover:opacity-100
          scale-0 group-hover:scale-100
          transition-all duration-300
          mb-4
        "
      >
        <button
          className="
            bg-blue-400 text-white px-4 py-2 
            rounded shadow-lg hover:bg-blue-600 
            transition-all
          "
          onClick={addIsIsNot}
        >
          IS / IS NOT
        </button>
      </div>
      {/* Botón Principal */}
      <div className="
        w-16 h-16 rounded-full bg-blue-500 
        text-white text-3xl flex items-center justify-center 
        shadow-lg cursor-pointer 
        transform transition-all duration-300 
        group-hover:translate-y-2
      ">
        <AiOutlinePlus />
      </div>
    </div>
  );
};

export default FloatingButton;