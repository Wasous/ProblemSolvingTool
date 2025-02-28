import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineDocumentText,
    HiOutlinePlusCircle,
    HiOutlineDocumentText as DocumentIcon,
    HiOutlineChartBar as ChartIcon,
    HiOutlineViewGrid as GridIcon
} from 'react-icons/hi';
import IsIsNotCard from './IsIsNot';
import RichTextCard from './RichTextCard';
import SipocCard from './Sipoc';

const ContentArea = ({
    currentStage,
    currentCards,
    handleAddCard,
    handleDeleteCard,
    handleSaveCard,
    leftPanelOpen,
    rightPanelOpen
}) => {
    // Card type options for the quick add menu
    const cardTypes = [
        {
            id: 'RICH_TEXT',
            name: 'Document',
            icon: DocumentIcon,
            description: 'Add formatted text, headings, and lists',
            color: 'bg-emerald-500 text-white'
        },
        {
            id: 'IS_IS_NOT',
            name: 'Is/Is Not',
            icon: ChartIcon,
            description: 'Define problem boundaries clearly',
            color: 'bg-blue-500 text-white'
        },
        {
            id: 'SIPOC',
            name: 'SIPOC',
            icon: GridIcon,
            description: 'Map process elements and relationships',
            color: 'bg-amber-500 text-white'
        }
    ];

    // Animation variants for card entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className={`
            flex-1 h-full p-4 sm:p-6 overflow-y-auto overflow-x-hidden bg-gray-50
            transition-all duration-300
            ${leftPanelOpen ? 'ml-[352px]' : 'ml-16'}
            ${rightPanelOpen ? 'mr-96' : 'mr-16'}
        `}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                        {currentStage} Phase
                    </h1>

                    {/* Quick Add Dropdown */}
                    <div className="relative group">
                        <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center shadow-sm">
                            <HiOutlinePlusCircle className="mr-1" size={20} />
                            <span>Add Tool</span>
                        </button>

                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-10 overflow-hidden border border-gray-200">
                            {cardTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleAddCard(type.id)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                                >
                                    <div className="flex items-start">
                                        <div className={`p-2 rounded-lg ${type.color} mr-3 flex-shrink-0`}>
                                            <type.icon size={16} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{type.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cards for current phase */}
                <AnimatePresence>
                    {currentCards.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full text-indigo-500 mb-4">
                                <HiOutlineDocumentText size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                Start adding content for the {currentStage.toLowerCase()} phase using the tools below.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {cardTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => handleAddCard(type.id)}
                                        className={`flex items-center px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors ${type.color}`}
                                    >
                                        <type.icon className="mr-2" size={16} />
                                        Add {type.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {currentCards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {card.type === 'IS_IS_NOT' && (
                                        <IsIsNotCard
                                            data={card.data}
                                            onDelete={() => handleDeleteCard(card.id)}
                                            onSave={(newData) => handleSaveCard(card.id, newData)}
                                        />
                                    )}

                                    {card.type === 'RICH_TEXT' && (
                                        <RichTextCard
                                            initialValue={card.data}
                                            onDelete={() => handleDeleteCard(card.id)}
                                            onSave={(newContent) => handleSaveCard(card.id, newContent)}
                                        />
                                    )}

                                    {card.type === 'SIPOC' && (
                                        <SipocCard
                                            data={card.data}
                                            onDelete={() => handleDeleteCard(card.id)}
                                            onSave={(newData) => handleSaveCard(card.id, newData)}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ContentArea;