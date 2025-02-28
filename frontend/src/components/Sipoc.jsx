import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const SipocCard = ({ data, onSave, onDelete }) => {
  // Initialize with editionMode from data if available, or false
  const [editionMode, setEditionMode] = useState(data.editionMode || false);
  const [editableData, setEditableData] = useState(data);
  const [originalData, setOriginalData] = useState(data);

  // Update local state when inputs change
  const handleChange = (key, value) => {
    setEditableData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Save changes
  const handleSave = () => {
    // Create updated data with editionMode explicitly set to false
    const updatedData = {
      ...editableData,
      editionMode: false
    };

    setEditionMode(false);
    setOriginalData(updatedData);

    if (onSave) onSave(updatedData);
  };

  // Cancel edits
  const handleCancel = () => {
    setEditableData(originalData);
    setEditionMode(false);
  };

  // Delete card
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
          value={editableData.title || 'SIPOC'}
          onChange={(e) => setEditableData({ ...editableData, title: e.target.value })}
        />
      ) : (
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editableData.title || 'SIPOC'}
        </h2>
      )}

      {/* SIPOC Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="bg-gray-100 text-gray-600 p-3 text-left">Category</th>
            <th className="bg-gray-100 text-gray-600 p-3 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {["Suppliers", "Inputs", "Process", "Outputs", "Customers"].map((category, index) => (
            <tr key={index} className="border-t border-gray-300">
              <td className="bg-gray-50 p-3 font-semibold text-gray-700">{category}</td>
              <td className="p-3">
                {editionMode ? (
                  <textarea
                    className="w-full p-2 border rounded h-16"
                    value={editableData[category.toLowerCase()] || ''}
                    onChange={(e) => handleChange(category.toLowerCase(), e.target.value)}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">
                    {editableData[category.toLowerCase()] || 'No details provided.'}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="mt-4 text-right space-x-4 justify-end display: flex">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => (editionMode ? handleSave() : setEditionMode(true))}
        >
          {editionMode ? 'Save' : 'Edit'}
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

export default SipocCard;