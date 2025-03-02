import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardContainer from './CardContainer';
import { FaPlus, FaTrash, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';

const FishboneDiagram = ({ data, onSave, onDelete }) => {
    const defaultCategories = [
        { id: 'people', name: 'People', color: 'bg-blue-100 border-blue-200 text-blue-800' },
        { id: 'methods', name: 'Methods', color: 'bg-green-100 border-green-200 text-green-800' },
        { id: 'machines', name: 'Machines', color: 'bg-purple-100 border-purple-200 text-purple-800' },
        { id: 'materials', name: 'Materials', color: 'bg-yellow-100 border-yellow-200 text-yellow-800' },
        { id: 'measurements', name: 'Measurements', color: 'bg-red-100 border-red-200 text-red-800' },
        { id: 'environment', name: 'Environment', color: 'bg-indigo-100 border-indigo-200 text-indigo-800' }
    ];

    const [editionMode, setEditionMode] = useState(data.editionMode || false);
    const [editableData, setEditableData] = useState(() => {
        // Initialize with default categories if they don't exist
        if (!data.categories || data.categories.length === 0) {
            return {
                ...data,
                categories: defaultCategories,
                causes: data.causes || []
            };
        }
        return data;
    });

    const [originalData, setOriginalData] = useState(() => {
        // Initialize with default categories if they don't exist
        if (!data.categories || data.categories.length === 0) {
            return {
                ...data,
                categories: defaultCategories,
                causes: data.causes || []
            };
        }
        return data;
    });

    // For category and cause editing
    const [editingCauseId, setEditingCauseId] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', color: 'bg-gray-100 border-gray-200 text-gray-800' });
    const [causeForm, setCauseForm] = useState({
        text: '',
        categoryId: editableData.categories?.[0]?.id || 'people',
        note: ''
    });

    // Save changes
    const handleSave = () => {
        const updatedData = {
            ...editableData,
            editionMode: false
        };

        setEditionMode(false);
        setOriginalData(updatedData);

        if (onSave) {
            onSave(updatedData);
        }
    };

    // Cancel edits
    const handleCancel = () => {
        setEditableData(originalData);
        setEditionMode(false);
        setEditingCauseId(null);
    };

    // Update problem statement
    const handleProblemStatementChange = (value) => {
        setEditableData((prevData) => ({
            ...prevData,
            problemStatement: value
        }));
    };

    // Add new category
    const addCategory = () => {
        if (!newCategory.name) return;

        const newCategoryObj = {
            id: `category-${Date.now()}`,
            name: newCategory.name,
            color: newCategory.color
        };

        setEditableData((prevData) => ({
            ...prevData,
            categories: [...(prevData.categories || []), newCategoryObj]
        }));

        setNewCategory({ name: '', color: 'bg-gray-100 border-gray-200 text-gray-800' });
    };

    // Delete category
    const deleteCategory = (categoryId) => {
        setEditableData((prevData) => ({
            ...prevData,
            categories: (prevData.categories || []).filter(cat => cat.id !== categoryId),
            // Remove causes associated with this category
            causes: (prevData.causes || []).filter(cause => cause.categoryId !== categoryId)
        }));
    };

    // Add new cause
    const addCause = () => {
        if (!causeForm.text || !causeForm.categoryId) return;

        const newCause = {
            id: `cause-${Date.now()}`,
            text: causeForm.text,
            categoryId: causeForm.categoryId,
            note: causeForm.note
        };

        setEditableData((prevData) => ({
            ...prevData,
            causes: [...(prevData.causes || []), newCause]
        }));

        // Reset form
        setCauseForm({
            text: '',
            categoryId: editableData.categories?.[0]?.id || 'people',
            note: ''
        });
    };

    // Update cause
    const updateCause = () => {
        if (!editingCauseId || !causeForm.text) return;

        setEditableData((prevData) => ({
            ...prevData,
            causes: (prevData.causes || []).map(cause =>
                cause.id === editingCauseId
                    ? { ...cause, text: causeForm.text, categoryId: causeForm.categoryId, note: causeForm.note }
                    : cause
            )
        }));

        setEditingCauseId(null);
        setCauseForm({
            text: '',
            categoryId: editableData.categories?.[0]?.id || 'people',
            note: ''
        });
    };

    // Edit cause
    const editCause = (cause) => {
        setEditingCauseId(cause.id);
        setCauseForm({
            text: cause.text,
            categoryId: cause.categoryId,
            note: cause.note || ''
        });
    };

    // Delete cause
    const deleteCause = (causeId) => {
        setEditableData((prevData) => ({
            ...prevData,
            causes: (prevData.causes || []).filter(cause => cause.id !== causeId)
        }));

        if (editingCauseId === causeId) {
            setEditingCauseId(null);
            setCauseForm({
                text: '',
                categoryId: editableData.categories?.[0]?.id || 'people',
                note: ''
            });
        }
    };

    // Get causes for a specific category
    const getCausesForCategory = (categoryId) => {
        return (editableData.causes || []).filter(
            cause => cause.categoryId === categoryId
        );
    };

    // Get category by ID
    const getCategoryById = (categoryId) => {
        return (editableData.categories || []).find(cat => cat.id === categoryId);
    };

    // Get category name
    const getCategoryName = (categoryId) => {
        const category = getCategoryById(categoryId);
        return category ? category.name : '';
    };

    // Handle cause form input changes
    const handleCauseFormChange = (field, value) => {
        setCauseForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Available colors for categories
    const colorOptions = [
        { value: 'bg-blue-100 border-blue-200 text-blue-800', label: 'Blue' },
        { value: 'bg-green-100 border-green-200 text-green-800', label: 'Green' },
        { value: 'bg-purple-100 border-purple-200 text-purple-800', label: 'Purple' },
        { value: 'bg-yellow-100 border-yellow-200 text-yellow-800', label: 'Yellow' },
        { value: 'bg-red-100 border-red-200 text-red-800', label: 'Red' },
        { value: 'bg-indigo-100 border-indigo-200 text-indigo-800', label: 'Indigo' },
        { value: 'bg-pink-100 border-pink-200 text-pink-800', label: 'Pink' },
        { value: 'bg-orange-100 border-orange-200 text-orange-800', label: 'Orange' },
        { value: 'bg-gray-100 border-gray-200 text-gray-800', label: 'Gray' },
    ];

    return (
        <CardContainer
            title={editableData.title || 'Fishbone Diagram'}
            type="FISHBONE_DIAGRAM"
            editionMode={editionMode}
            setEditionMode={setEditionMode}
            onSave={handleSave}
            onDelete={onDelete}
            onCancel={handleCancel}
            createdAt={data.createdAt}
            updatedAt={data.updatedAt}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={editionMode ? 'editing' : 'viewing'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Problem Statement Section */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                            <span className="inline-block w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                            Problem Statement
                        </h3>

                        {editionMode ? (
                            <textarea
                                value={editableData.problemStatement || ''}
                                onChange={(e) => handleProblemStatementChange(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/40 min-h-24 text-gray-700"
                                placeholder="Describe the problem to analyze..."
                            />
                        ) : (
                            <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-gray-700">
                                {editableData.problemStatement || (
                                    <span className="text-gray-400 italic">No problem statement provided.</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Fishbone Diagram Visualization */}
                    <div className="mb-6 overflow-x-auto pb-4">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Cause and Effect Analysis</h3>

                        <div className="min-w-[700px] relative">
                            {/* Effect box (problem) */}
                            <div className="flex justify-center mb-6">
                                <div className="w-64 h-16 bg-red-100 border border-red-300 rounded-lg flex items-center justify-center p-2 text-center font-medium text-red-800 shadow-sm">
                                    {editableData.problemStatement || 'Problem/Effect'}
                                </div>
                            </div>

                            {/* Main fishbone structure */}
                            <div className="flex space-x-4">
                                {/* Left side - Categories */}
                                <div className="w-1/2 pr-4">
                                    {(editableData.categories || []).slice(0, Math.ceil((editableData.categories || []).length / 2)).map((category, index) => (
                                        <div key={category.id} className="mb-8 last:mb-0">
                                            {/* Category heading */}
                                            <div className={`${category.color} p-2 rounded-lg border mb-2 shadow-sm flex justify-between items-center`}>
                                                <span className="font-medium">{category.name}</span>

                                                {editionMode && (
                                                    <button
                                                        onClick={() => deleteCategory(category.id)}
                                                        className="text-gray-500 hover:text-red-500 p-1 text-xs rounded"
                                                        title="Delete category"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Causes for this category */}
                                            <div className="pl-4 space-y-2">
                                                {getCausesForCategory(category.id).map(cause => (
                                                    <div
                                                        key={cause.id}
                                                        className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-start"
                                                    >
                                                        <div>
                                                            <p className="text-gray-800">{cause.text}</p>
                                                            {cause.note && (
                                                                <p className="text-xs text-gray-500 mt-1 italic">{cause.note}</p>
                                                            )}
                                                        </div>

                                                        {editionMode && (
                                                            <div className="flex space-x-1 ml-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => editCause(cause)}
                                                                    className="text-blue-500 hover:text-blue-700 p-1 text-xs rounded"
                                                                    title="Edit cause"
                                                                >
                                                                    <FaPencilAlt />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteCause(cause.id)}
                                                                    className="text-red-500 hover:text-red-700 p-1 text-xs rounded"
                                                                    title="Delete cause"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right side - Categories */}
                                <div className="w-1/2 pl-4">
                                    {(editableData.categories || []).slice(Math.ceil((editableData.categories || []).length / 2)).map((category, index) => (
                                        <div key={category.id} className="mb-8 last:mb-0">
                                            {/* Category heading */}
                                            <div className={`${category.color} p-2 rounded-lg border mb-2 shadow-sm flex justify-between items-center`}>
                                                <span className="font-medium">{category.name}</span>

                                                {editionMode && (
                                                    <button
                                                        onClick={() => deleteCategory(category.id)}
                                                        className="text-gray-500 hover:text-red-500 p-1 text-xs rounded"
                                                        title="Delete category"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Causes for this category */}
                                            <div className="pl-4 space-y-2">
                                                {getCausesForCategory(category.id).map(cause => (
                                                    <div
                                                        key={cause.id}
                                                        className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-start"
                                                    >
                                                        <div>
                                                            <p className="text-gray-800">{cause.text}</p>
                                                            {cause.note && (
                                                                <p className="text-xs text-gray-500 mt-1 italic">{cause.note}</p>
                                                            )}
                                                        </div>

                                                        {editionMode && (
                                                            <div className="flex space-x-1 ml-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => editCause(cause)}
                                                                    className="text-blue-500 hover:text-blue-700 p-1 text-xs rounded"
                                                                    title="Edit cause"
                                                                >
                                                                    <FaPencilAlt />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteCause(cause.id)}
                                                                    className="text-red-500 hover:text-red-700 p-1 text-xs rounded"
                                                                    title="Delete cause"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cause and Categories Management (Editor) */}
                    {editionMode && (
                        <div className="space-y-6 border-t border-gray-200 pt-6">
                            {/* Category Management */}
                            <div>
                                <h3 className="text-md font-medium text-gray-700 mb-4">Manage Categories</h3>

                                <div className="flex items-end gap-2 mb-4">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                        <input
                                            type="text"
                                            value={newCategory.name}
                                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="New category name"
                                        />
                                    </div>

                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                        <select
                                            value={newCategory.color}
                                            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            {colorOptions.map((color) => (
                                                <option key={color.value} value={color.value}>{color.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={addCategory}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                                        disabled={!newCategory.name}
                                    >
                                        <FaPlus className="mr-1" /> Add
                                    </button>
                                </div>

                                {/* List of current categories */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {(editableData.categories || []).map((category) => (
                                        <div
                                            key={category.id}
                                            className={`${category.color} p-2 rounded-lg border flex justify-between items-center`}
                                        >
                                            <span>{category.name}</span>
                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                className="text-gray-600 hover:text-red-500 p-1 rounded"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cause Management */}
                            <div>
                                <h3 className="text-md font-medium text-gray-700 mb-4">
                                    {editingCauseId ? 'Edit Cause' : 'Add New Cause'}
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cause Description</label>
                                        <input
                                            type="text"
                                            value={causeForm.text}
                                            onChange={(e) => handleCauseFormChange('text', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Describe the cause"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={causeForm.categoryId}
                                            onChange={(e) => handleCauseFormChange('categoryId', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            {(editableData.categories || []).map((category) => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                                        <textarea
                                            value={causeForm.note}
                                            onChange={(e) => handleCauseFormChange('note', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md min-h-16"
                                            placeholder="Additional details about this cause..."
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        {editingCauseId ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingCauseId(null);
                                                        setCauseForm({
                                                            text: '',
                                                            categoryId: editableData.categories?.[0]?.id || '',
                                                            note: ''
                                                        });
                                                    }}
                                                    className="px-3 py-1 text-gray-600 hover:text-gray-800 flex items-center"
                                                >
                                                    <FaTimes className="mr-1" /> Cancel
                                                </button>
                                                <button
                                                    onClick={updateCause}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                                                    disabled={!causeForm.text}
                                                >
                                                    <FaCheck className="mr-1" /> Update
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={addCause}
                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                                                disabled={!causeForm.text}
                                            >
                                                <FaPlus className="mr-1" /> Add Cause
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary View when not in edit mode */}
                    {!editionMode && editableData.causes && editableData.causes.length > 0 && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <h3 className="text-md font-medium text-gray-700 mb-4">Summary of Causes</h3>

                            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cause
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Notes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {editableData.causes.map((cause) => (
                                            <tr key={cause.id}>
                                                <td className="px-4 py-3 text-sm text-gray-800">
                                                    {cause.text}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {getCategoryName(cause.categoryId)}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500 italic">
                                                    {cause.note || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </CardContainer>
    );
};

export default FishboneDiagram;