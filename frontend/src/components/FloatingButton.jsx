import React, { useState, useRef, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const FloatingButton = ({ addIsIsNot, addRichText, addSipoc }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar si se hace click fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-10 right-8 z-50" ref={containerRef}>
      <div className="relative">
        {/* Botón Principal (+) */}
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="
            w-16 h-16 rounded-full bg-blue-500
            text-white text-3xl flex items-center justify-center
            shadow-lg cursor-pointer
            transition-all duration-300
          "
        >
          <AiOutlinePlus />
        </div>

        {/* Menú (sub-botones) con animación */}
        <div
          className={`absolute bottom-full right-0 mb-4 flex flex-col items-center space-y-3 
                      transition-all duration-300 origin-bottom
                      ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        >
          {/* Botón IS / IS NOT */}
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600 transition-all w-32"
            onClick={() => {
              addIsIsNot();
              setOpen(false);
            }}
          >
            IS / IS NOT
          </button>

          {/* Botón Rich Text */}
          <button
            className="bg-yellowDark text-white px-4 py-2 rounded shadow-lg hover:bg-yellowDarkHover transition-all w-32"
            onClick={() => {
              addRichText();
              setOpen(false);
            }}
          >
            TEXTBOX
          </button>

          {/* Botón SIPOC */}
          <button
            className="bg-yellowDark text-white px-4 py-2 rounded shadow-lg hover:bg-yellowDarkHover transition-all w-32"
            onClick={() => {
              addSipoc();
              setOpen(false);
            }}
          >
            SIPOC
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingButton;
