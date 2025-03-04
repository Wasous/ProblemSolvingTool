import React, { useState, useEffect } from 'react';
import { HiOutlineDocumentText, HiViewGrid, HiViewList } from 'react-icons/hi';
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
    rightPanelOpen,
    scrollToCardId,  // New prop for scroll-to functionality
}) => {
    // New state for view mode (grid or list)
    const [viewMode, setViewMode] = useState('grid');
    // State to track expanded/collapsed cards
    const [expandedCards, setExpandedCards] = useState({});

    // Reference for scrolling to a specific card
    const cardRefs = React.useRef({});

    // Handle scrolling to a specific card when scrollToCardId changes
    useEffect(() => {
        if (scrollToCardId && cardRefs.current[scrollToCardId]) {
            cardRefs.current[scrollToCardId].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [scrollToCardId]);

    // Register card ref
    const registerCardRef = (id, element) => {
        cardRefs.current[id] = element;
    };

    // Toggle card expansion
    const toggleCardExpansion = (cardId) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    // Set all cards to expanded or collapsed
    const toggleAllCards = (expanded) => {
        const updatedState = {};
        currentCards.forEach(card => {
            updatedState[card.id] = expanded;
        });
        setExpandedCards(updatedState);
    };

    // Determine if a card is expanded
    const isCardExpanded = (cardId) => {
        return expandedCards[cardId] !== false; // Default to expanded if not set
    };

    return (
        <div className={`
            flex-1 h-full p-6 overflow-y-auto overflow-x-hidden
            transition-all duration-300
            ${leftPanelOpen ? 'ml-[352px]' : 'ml-16'}
            ${rightPanelOpen ? 'mr-96' : 'mr-16'}
        `}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {currentStage} Phase
                    </h1>

                    {/* View controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => toggleAllCards(true)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={() => toggleAllCards(false)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                        >
                            Collapse All
                        </button>
                        <div className="flex rounded-md overflow-hidden border border-gray-200">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                                title="Grid View"
                            >
                                <HiViewGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
                                title="List View"
                            >
                                <HiViewList size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cards for current phase */}
                {currentCards.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-lg shadow">
                        <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No content yet</h3>
                        <p className="mt-2 text-gray-500">
                            Start adding content for this phase using the buttons below.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
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
                    <div
                        className={viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-6"
                        }
                    >
                        {currentCards.map((card) => {
                            const isExpanded = isCardExpanded(card.id);
                            const cardProps = {
                                key: card.id,
                                onDelete: () => handleDeleteCard(card.id),
                                onSave: (newData) => handleSaveCard(card.id, newData),
                                isCollapsed: !isExpanded,
                                onToggleCollapse: () => toggleCardExpansion(card.id),
                                ref: (el) => registerCardRef(card.id, el)
                            };

                            let CardComponent;
                            switch (card.type) {
                                case 'IS_IS_NOT':
                                    return (
                                        <div
                                            key={card.id}
                                            ref={(el) => registerCardRef(card.id, el)}
                                            className={viewMode === 'grid' && !isExpanded ? "col-span-1" : "col-span-full"}
                                        >
                                            <IsIsNotCard
                                                data={card.data}
                                                onDelete={() => handleDeleteCard(card.id)}
                                                onSave={(newData) => handleSaveCard(card.id, newData)}
                                                isCollapsed={!isExpanded}
                                                onToggleCollapse={() => toggleCardExpansion(card.id)}
                                            />
                                        </div>
                                    );
                                case 'RICH_TEXT':
                                    return (
                                        <div
                                            key={card.id}
                                            ref={(el) => registerCardRef(card.id, el)}
                                            className={viewMode === 'grid' && !isExpanded ? "col-span-1" : "col-span-full"}
                                        >
                                            <RichTextCard
                                                initialValue={card.data}
                                                onDelete={() => handleDeleteCard(card.id)}
                                                onSave={(newContent) => handleSaveCard(card.id, newContent)}
                                                isCollapsed={!isExpanded}
                                                onToggleCollapse={() => toggleCardExpansion(card.id)}
                                            />
                                        </div>
                                    );
                                case 'SIPOC':
                                    return (
                                        <div
                                            key={card.id}
                                            ref={(el) => registerCardRef(card.id, el)}
                                            className={viewMode === 'grid' && !isExpanded ? "col-span-1" : "col-span-full"}
                                        >
                                            <SipocCard
                                                data={card.data}
                                                onDelete={() => handleDeleteCard(card.id)}
                                                onSave={(newData) => handleSaveCard(card.id, newData)}
                                                isCollapsed={!isExpanded}
                                                onToggleCollapse={() => toggleCardExpansion(card.id)}
                                            />
                                        </div>
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