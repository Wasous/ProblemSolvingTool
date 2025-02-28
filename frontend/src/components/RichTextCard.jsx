import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { FaTrash } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'link'],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['blockquote', 'code-block'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'size',
    'bold', 'italic', 'underline', 'strike', 'link',
    'script',
    'list', 'bullet',
    'indent',
    'align',
    'color', 'background',
    'blockquote', 'code-block',
];

const RichTextCard = ({ initialValue, onDelete, onSave }) => {
    // Set initial edit mode from initial value
    const [editionMode, setEditionMode] = useState(initialValue.editionMode || false);
    const [content, setContent] = useState(initialValue);
    const [originalContent, setOriginalContent] = useState(initialValue);

    // Handle changes for any property of content
    const handleChange = (field, value) => {
        setContent((prev) => ({ ...prev, [field]: value }));
    };

    // Edit mode
    const handleEdit = () => {
        setOriginalContent(content); // Save current state
        setEditionMode(true);
    };

    // Save changes
    const handleSave = () => {
        // Create updated data object with editionMode explicitly set to false
        const updatedContent = {
            ...content,
            editionMode: false // Explicitly save editionMode state
        };

        setEditionMode(false);
        setContent(updatedContent);

        // Pass the updated content to parent component for saving
        onSave?.(updatedContent);
    };

    // Cancel edits
    const handleCancel = () => {
        setContent(originalContent); // Restore original values
        setEditionMode(false);
    };

    // Delete card
    const handleDelete = () => {
        if (confirm('¿Seguro que quieres eliminar esta tarjeta?')) {
            onDelete?.();
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-screen-lg mx-auto mb-6">
            {/* Title */}
            {editionMode ? (
                <input
                    type="text"
                    value={content.title || ""}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="text-2xl font-bold text-gray-800 mb-4 w-full p-2 border rounded"
                    placeholder="Enter title..."
                />
            ) : (
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{content.title || "Untitled Document"}</h2>
            )}

            {/* Content or Editor */}
            {editionMode ? (
                <ReactQuill
                    theme="snow"
                    value={content.content || ""}
                    onChange={(value) => handleChange('content', value)}
                    modules={modules}
                    formats={formats}
                    className="mb-4"
                />
            ) : (
                <div className="mb-4 ql-snow">
                    <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: content.content || "" }}
                    />
                </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3">
                {editionMode ? (
                    <>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleEdit}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Edit
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

export default RichTextCard;