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
        ['clean']
    ]
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
    'blockquote', 'code-block'
];

const RichTextCard = ({ initialValue = '<p>¡Empieza a escribir aquí!</p>', onDelete }) => {
    const [editionMode, setEditionMode] = useState(false);
    const [content, setContent] = useState(initialValue);
    const [originalContent, setOriginalContent] = useState(initialValue);

    // Manejar cambios en el editor
    const handleChange = (value) => {
        setContent(value);
    };

    // Editar: guardamos el estado actual como originalContent para poder recuperarlo en caso de cancelar
    const handleEdit = () => {
        setOriginalContent(content);
        setEditionMode(true);
    };

    // Guardar
    const handleSave = () => {
        setEditionMode(false);
    };

    // Cancelar: restaurar el contenido original
    const handleCancel = () => {
        setContent(originalContent);
        setEditionMode(false);
    };

    // Eliminar
    const handleDelete = () => {
        if (confirm('¿Seguro que quieres eliminar esta tarjeta?')) {
            onDelete?.();
            // Llama a la función del padre si existe. 
            // O puedes poner lógica aquí para ocultar/componente si no usas un padre.
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-screen-lg mx-auto mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rich Text Editor</h2>

            {/* Contenido o Editor */}
            {editionMode ? (
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={handleChange}
                    modules={modules}
                    formats={formats}
                    className="mb-4"
                />
            ) : (
                <div className="mb-4 ql-snow">
                    <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            )}

            {/* Botones */}
            <div className="flex items-center justify-end space-x-3">

                {/* Si estamos en edición: Guardar/Cancelar, si no: Editar */}
                {editionMode ? (
                    <>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Guardar
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleEdit}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Editar
                    </button>
                )}
                {/* Eliminar siempre visible */}
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
