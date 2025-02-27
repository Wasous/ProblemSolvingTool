import React from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi';
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
    return (
        <div className={`
            h-full p-6 overflow-y-auto
            transition-all duration-300
            ${leftPanelOpen ? 'ml-[352px]' : 'ml-16'}
            ${rightPanelOpen ? 'mr-96' : 'mr-16'} // Increased margin to prevent content from being covered
        `}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {currentStage} Phase
                </h1>

                {/* Cards for current phase */}
                {currentCards.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-lg shadow">
                        <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No content yet</h3>
                        <p className="mt-2 text-gray-500">
                            Start adding content for this phase using the buttons below.
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                onClick={() => handleAddCard('RICH_TEXT')}
                                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100"
                            >
                                Add Text Document
                            </button>
                            <button
                                onClick={() => handleAddCard('IS_IS_NOT')}
                                className="bg-green-50 text-green-700 px-4 py-2 rounded-md hover:bg-green-100"
                            >
                                Add IS/IS NOT Analysis
                            </button>
                            <button
                                onClick={() => handleAddCard('SIPOC')}
                                className="bg-amber-50 text-amber-700 px-4 py-2 rounded-md hover:bg-amber-100"
                            >
                                Add SIPOC Diagram
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {currentCards.map((card) => {
                            switch (card.type) {
                                case 'IS_IS_NOT':
                                    return (
                                        <IsIsNotCard
                                            key={card.id}
                                            data={card.data}
                                            onDelete={() => handleDeleteCard(card.id)}
                                            onSave={(newData) => handleSaveCard(card.id, newData)}
                                        />
                                    );
                                case 'RICH_TEXT':
                                    return (
                                        <RichTextCard
                                            key={card.id}
                                            initialValue={card.data}
                                            onDelete={() => handleDeleteCard(card.id)}
                                            onSave={(newContent) =>
                                                handleSaveCard(card.id, { ...card.data, content: newContent })
                                            }
                                        />
                                    );
                                case 'SIPOC':
                                    return (
                                        <SipocCard
                                            key={card.id}
                                            data={card.data}
                                            onDelete={() => handleDeleteCard(card.id)}
                                            onSave={(newData) => handleSaveCard(card.id, newData)}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentArea;