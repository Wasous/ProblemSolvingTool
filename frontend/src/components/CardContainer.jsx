import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { HiDotsVertical, HiPencil, HiTrash, HiSave, HiX } from 'react-icons/hi';

// Animation variants for consistent transitions
const cardVariants = {
    hidden: { opacity: 0, y: 20, transition: { duration: 0.3 } },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1.0]  // Smooth easing function
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.3
        }
    }
};

// Variants for content transition
const contentVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.3, delay: 0.1 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

const CardContainer = ({
    title,
    type,
    children,
    onSave,
    onDelete,
    editionMode,
    setEditionMode,
    onCancel,
    createdAt,
    updatedAt
}) => {
    // Ensure we're passing editionMode in the save handler
    const handleSave = () => {
        if (onSave) {
            onSave({ title, editionMode: false });
            setEditionMode(false);
        }
    };
    const [showMenu, setShowMenu] = useState(false);

    // Card type colors and icons
    const cardTypes = {
        'IS_IS_NOT': {
            color: 'from-blue-500/10 to-indigo-500/5',
            borderColor: 'border-blue-200',
            icon: '⊕' // Custom icon
        },
        'RICH_TEXT': {
            color: 'from-emerald-500/10 to-teal-500/5',
            borderColor: 'border-emerald-200',
            icon: '¶' // Custom icon
        },
        'SIPOC': {
            color: 'from-amber-500/10 to-yellow-500/5',
            borderColor: 'border-amber-200',
            icon: '⊡' // Custom icon
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <LayoutGroup>
            <motion.div
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`relative bg-white rounded-xl overflow-hidden shadow-sm border 
                    ${cardTypes[type]?.borderColor || 'border-gray-200'}
                    transition-shadow hover:shadow-md`}
                layoutId={`card-${title}-${type}`}
                layoutDependency={editionMode}
            >
                {/* Card header with gradient background */}
                <motion.div
                    layout="position"
                    className={`relative bg-gradient-to-r ${cardTypes[type]?.color || 'from-gray-100 to-gray-50'} p-4 border-b border-gray-100`}
                >
                    <div className="flex items-center">
                        {/* Card type indicator */}
                        <motion.div
                            layout
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-white/70 backdrop-blur-sm 
                                text-lg font-medium shadow-sm mr-3 border border-gray-100"
                        >
                            {cardTypes[type]?.icon || '?'}
                        </motion.div>

                        {/* Title (editable or display) */}
                        <AnimatePresence mode="wait" initial={false}>
                            {editionMode ? (
                                <motion.div
                                    key="edit-title"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => onSave({ title: e.target.value })}
                                        className="flex-grow text-lg font-medium bg-white/50 backdrop-blur-sm 
                                            rounded px-2 py-1 border border-gray-200 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500/30 focus:border-transparent"
                                    />
                                </motion.div>
                            ) : (
                                <motion.h2
                                    key="display-title"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-lg font-medium text-gray-800"
                                >
                                    {title}
                                </motion.h2>
                            )}
                        </AnimatePresence>

                        {/* Menu for card actions */}
                        <div className="ml-auto relative">
                            <AnimatePresence mode="wait" initial={false}>
                                {editionMode ? (
                                    <motion.div
                                        key="edit-buttons"
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center gap-2"
                                    >
                                        <button
                                            onClick={onCancel}
                                            className="p-2 rounded-full hover:bg-white/50 text-gray-600 hover:text-red-500 transition-colors"
                                            aria-label="Cancel"
                                        >
                                            <HiX className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center"
                                            aria-label="Save"
                                        >
                                            <HiSave className="w-5 h-5 mr-1" />
                                            <span className="text-sm">Save</span>
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="view-menu"
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <button
                                            onClick={() => setShowMenu(!showMenu)}
                                            className="p-2 rounded-full hover:bg-white/50 text-gray-500 hover:text-gray-800 transition-colors"
                                            aria-label="Menu"
                                        >
                                            <HiDotsVertical className="w-5 h-5" />
                                        </button>

                                        <AnimatePresence>
                                            {showMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: [0.23, 1, 0.32, 1]
                                                    }}
                                                    className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setEditionMode(true);
                                                            setShowMenu(false);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-gray-700"
                                                    >
                                                        <HiPencil className="w-4 h-4 mr-2 text-blue-500" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            onDelete();
                                                            setShowMenu(false);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600"
                                                    >
                                                        <HiTrash className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Metadata (creation/update date) - only shown when not editing */}
                    <AnimatePresence>
                        {!editionMode && (updatedAt || createdAt) && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="mt-2 text-xs text-gray-500 flex items-center"
                            >
                                {updatedAt ? (
                                    <span>Updated {formatDate(updatedAt)}</span>
                                ) : (
                                    <span>Created {formatDate(createdAt)}</span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Card content with animated transitions */}
                <motion.div
                    layout="position"
                    className="p-4"
                    transition={{
                        layout: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
                    }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={editionMode ? 'edit-content' : 'view-content'}
                            variants={contentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </LayoutGroup>
    );
};

export default CardContainer;