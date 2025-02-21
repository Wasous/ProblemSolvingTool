import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const IsIsNotCard = ({ data, onSave, onDelete }) => {
  // Si data.editionMode es true, arrancamos directamente en edición:
  const [editionMode, setEditionMode] = useState(data.editionMode || false);
  const [editableData, setEditableData] = useState(data);
  const [originalData, setOriginalData] = useState(data);

  // Actualizar el estado local cuando cambian los inputs
  const handleChange = (section, key, value) => {
    setEditableData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [key]: value,
      },
    }));
  };

  // Guardar
  const handleSave = () => {
    setEditionMode(false);
    setOriginalData(editableData);
    if (onSave) onSave(editableData);
  };

  // Cancelar
  const handleCancel = () => {
    setEditableData(originalData);
    setEditionMode(false);
  };

  //Eliminar
  const handleDelete = () => {
    if (confirm("¿Seguro que quieres eliminar esta herramienta?")) {
      onDelete(data.id);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-screen-lg mx-auto mb-6">
      {editionMode ? (
        <input
          className="text-2xl font-bold text-gray-800 mb-4 w-full p-2 border rounded"
          value={editableData.title || 'IS / IS NOT'}
          onChange={(e) => setEditableData({ ...editableData, title: e.target.value })}
        />
      ) : (
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editableData.title || 'IS / IS NOT'}
        </h2>
      )}

      {/* Problem Statement */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Problem Statement</h3>
        {editionMode ? (
          <textarea
            className="w-full p-2 border rounded h-24"
            value={editableData.problemStatement}
            onChange={(e) => setEditableData({ ...editableData, problemStatement: e.target.value })}
          />
        ) : (
          <p className="text-gray-600 whitespace-pre-wrap">{editableData.problemStatement}</p>
        )}
      </div>

      {/* Tabla Editable */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="bg-gray-100 text-gray-600 p-3 text-left">Category</th>
            <th className="bg-gray-100 text-gray-600 p-3 text-left">IS</th>
            <th className="bg-gray-100 text-gray-600 p-3 text-left">IS NOT</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: 'WHAT', key: 'what' },
            { label: 'WHERE', key: 'where' },
            { label: 'WHEN', key: 'when' },
            { label: 'WHO', key: 'who' },
            { label: 'HOW MUCH', key: 'howMuch' },
          ].map((category, index) => (
            <tr key={index} className="border-t border-gray-300">
              <td className="bg-gray-50 p-3 font-semibold text-gray-700">{category.label}</td>
              <td className="p-3">
                {editionMode ? (
                  <textarea
                    className="w-full p-2 border rounded h-16"
                    value={editableData.is[category.key]}
                    onChange={(e) => handleChange('is', category.key, e.target.value)}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{editableData.is[category.key]}</p>
                )}
              </td>
              <td className="p-3">
                {editionMode ? (
                  <textarea
                    className="w-full p-2 border rounded h-16"
                    value={editableData.isNot[category.key]}
                    onChange={(e) => handleChange('isNot', category.key, e.target.value)}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{editableData.isNot[category.key]}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botones */}
      <div className="mt-4 text-right space-x-4 justify-end display: flex">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => (editionMode ? handleSave() : setEditionMode(true))}
        >
          {editionMode ? 'Guardar' : 'Editar'}
        </button>
        {editionMode && (
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={handleCancel}
          >
            Cancel
          </button>

        )}
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaTrash size={16} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default IsIsNotCard;
