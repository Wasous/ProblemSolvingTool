import React, { useState, useRef, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTable,
  FaFileAlt,
  FaTimes
} from 'react-icons/fa';
import * as Tooltip from '@radix-ui/react-tooltip';

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
      icon: <FaEdit size={16} />,
      label: "IS / IS NOT",
      onClick: addIsIsNot,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <FaFileAlt size={16} />,
      label: "TEXTBOX",
      onClick: addRichText,
      color: "bg-yellowDark hover:bg-yellowDarkHover"
    },
    {
      icon: <FaTable size={16} />,
      label: "SIPOC",
      onClick: addSipoc,
      color: "bg-yellowDark hover:bg-yellowDarkHover"
    }
  ];

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="fixed bottom-6 right-6 z-50" ref={containerRef}>
        <div className="relative">
          {/* Main Floating Action Button */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
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

          {/* Action Buttons Menu */}
          <div className={`
            absolute bottom-full right-0 mb-3
            transition-all duration-300 ease-in-out
            ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}
            space-y-3
          `}>
            {actionButtons.map((button, index) => (
              <Tooltip.Root key={index}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => {
                      button.onClick();
                      setOpen(false);
                    }}
                    className={`
                      w-12 h-12 rounded-full ml-auto block
                      ${button.color} 
                      text-white flex items-center justify-center
                      shadow-md 
                      transform transition-all duration-200 ease-out
                      ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
                    `}
                    style={{
                      transitionDelay: open ? `${(actionButtons.length - index - 1) * 50}ms` : '0ms'
                    }}
                  >
                    {button.icon}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded shadow-md z-50"
                    sideOffset={5}
                    side="left"
                    align="center"
                  >
                    {button.label}
                    <Tooltip.Arrow className="fill-gray-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default FloatingButton;