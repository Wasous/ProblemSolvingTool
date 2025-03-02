import React, { useState, useRef, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTable,
  FaFileAlt,
  FaTimes
} from 'react-icons/fa';

const FloatingButton = ({ addIsIsNot, addRichText, addSipoc }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close if clicked outside container
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

  const actionButtons = [
    {
      icon: <FaEdit size={20} />,
      label: "IS / IS NOT Analysis",
      description: "For problem boundary definition",
      onClick: addIsIsNot,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <FaFileAlt size={20} />,
      label: "Rich Text Document",
      description: "For detailed documentation",
      onClick: addRichText,
      color: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
      icon: <FaTable size={20} />,
      label: "SIPOC Diagram",
      description: "For process mapping",
      onClick: addSipoc,
      color: "bg-amber-500 hover:bg-amber-600"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={containerRef}>
      <div className="relative">
        {/* Main Floating Action Button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Add new tool"}
          className={`
            w-14 h-14 rounded-full 
            bg-blue-500
            text-white flex items-center justify-center
            shadow-lg hover:shadow-xl hover:bg-blue-600
            transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
          `}
        >
          {open ? (
            <FaTimes size={20} className="transition-transform duration-300" />
          ) : (
            <FaPlus size={20} className="transition-transform duration-300" />
          )}
        </button>

        {/* Action Buttons Menu - Now with labels */}
        <div className={`
          absolute bottom-full right-0 mb-3
          transition-all duration-300 ease-in-out
          ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}
          space-y-3 flex flex-col items-end
        `}>
          {actionButtons.map((button, index) => (
            <div
              key={index}
              className={`
                flex items-center
                transform transition-all duration-200 ease-out
                ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
              `}
              style={{
                transitionDelay: open ? `${(actionButtons.length - index - 1) * 50}ms` : '0ms'
              }}
            >
              {/* Label Card */}
              <div
                className={`
                  py-2 px-3 mr-2 rounded-lg shadow-md
                  bg-white border border-gray-200
                  text-right
                `}
              >
                <p className="font-medium text-gray-800 text-sm whitespace-nowrap">{button.label}</p>
                <p className="text-xs text-gray-500">{button.description}</p>
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  button.onClick();
                  setOpen(false);
                }}
                className={`
                  w-14 h-14 rounded-full flex-shrink-0
                  ${button.color} 
                  text-white flex items-center justify-center
                  shadow-md 
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                `}
                aria-label={button.label}
              >
                {button.icon}
              </button>
            </div>
          ))}
        </div>

        {/* Add Tool Label */}
        {!open && (
          <div className="absolute bottom-0 right-16 mb-3 mr-2 bg-white px-3 py-1.5 rounded-md shadow text-sm font-medium text-gray-700 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Add Tool
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingButton;