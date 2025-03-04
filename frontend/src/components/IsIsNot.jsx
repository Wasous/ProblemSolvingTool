import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardContainer from './CardContainer';

// Animation variants for smoother transitions
const contentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0 },
  visible: (custom) => ({
    opacity: 1,
    transition: { duration: 0.3, delay: custom * 0.05 }
  })
};

const IsIsNotCard = ({
  data,
  onSave,
  onDelete,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [editionMode, setEditionMode] = useState(data.editionMode || false);
  const [editableData, setEditableData] = useState(data);
  const [originalData, setOriginalData] = useState(data);

  // Update local state when form fields change
  const handleChange = (section, key, value) => {
    setEditableData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [key]: value,
      },
    }));
  };

  // Update problem statement
  const handleProblemStatementChange = (value) => {
    setEditableData((prevData) => ({
      ...prevData,
      problemStatement: value
    }));
  };

  // Save changes
  const handleSave = () => {
    // Explicitly set editionMode to false to persist this state
    const updatedData = {
      ...editableData,
      editionMode: false
    };

    setEditionMode(false);
    setOriginalData(updatedData);

    // Make sure we're passing the complete data object to the parent
    if (onSave) {
      onSave(updatedData);
    }
  };

  // Cancel edits
  const handleCancel = () => {
    setEditableData(originalData);
    setEditionMode(false);
  };

  // Categories for analysis
  const categories = [
    { label: 'WHAT', key: 'what' },
    { label: 'WHERE', key: 'where' },
    { label: 'WHEN', key: 'when' },
    { label: 'WHO', key: 'who' },
    { label: 'HOW MUCH', key: 'howMuch' }
  ];

  // Generate a preview of the content for collapsed state
  const getPreviewContent = () => {
    return (
      <div className="text-sm">
        <p className="text-gray-700 font-medium">Problem Statement:</p>
        <p className="text-gray-600 line-clamp-2">
          {editableData.problemStatement || "No problem statement defined."}
        </p>
      </div>
    );
  };

  return (
    <CardContainer
      title={editableData.title || 'IS / IS NOT'}
      type="IS_IS_NOT"
      editionMode={editionMode}
      setEditionMode={setEditionMode}
      onSave={handleSave}
      onDelete={onDelete}
      onCancel={handleCancel}
      createdAt={data.createdAt}
      updatedAt={data.updatedAt}
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
    >
      {isCollapsed ? (
        // Preview content for collapsed state
        getPreviewContent()
      ) : (
        // Full content when expanded
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={editionMode ? 'editing' : 'viewing'}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Problem Statement Section */}
            <motion.div
              className="mb-6"
              layout
            >
              <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                Problem Statement
              </h3>

              {editionMode ? (
                <motion.textarea
                  initial={{ height: "auto" }}
                  animate={{ height: "auto" }}
                  transition={{ duration: 0.3 }}
                  value={editableData.problemStatement || ''}
                  onChange={(e) => handleProblemStatementChange(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-h-24 text-gray-700"
                  placeholder="Describe the problem..."
                />
              ) : (
                <motion.div
                  layout
                  className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-gray-700"
                >
                  {editableData.problemStatement || (
                    <span className="text-gray-400 italic">No problem statement provided.</span>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* IS/IS NOT Analysis Table */}
            <motion.div
              className="overflow-hidden rounded-lg border border-gray-200"
              layout
            >
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                <div className="p-3 font-medium text-gray-600">Category</div>
                <div className="p-3 font-medium text-gray-600 border-l border-gray-200">IS</div>
                <div className="p-3 font-medium text-gray-600 border-l border-gray-200">IS NOT</div>
              </div>

              {/* Table Body - With animated rows */}
              <div className="divide-y divide-gray-200">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.key}
                    className="grid grid-cols-3"
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                  >
                    <div className="p-3 font-medium text-gray-700 bg-gray-50 flex items-center">
                      {category.label}
                    </div>

                    <div className="p-3 border-l border-gray-200">
                      <AnimatePresence mode="wait">
                        {editionMode ? (
                          <motion.textarea
                            key={`is-${category.key}-edit`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-16 text-sm"
                            value={(editableData.is && editableData.is[category.key]) || ''}
                            onChange={(e) => handleChange('is', category.key, e.target.value)}
                            placeholder={`${category.label} is...`}
                          />
                        ) : (
                          <motion.p
                            key={`is-${category.key}-view`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-pre-wrap text-gray-700"
                          >
                            {(editableData.is && editableData.is[category.key]) || (
                              <span className="text-gray-400 italic">Not specified</span>
                            )}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="p-3 border-l border-gray-200">
                      <AnimatePresence mode="wait">
                        {editionMode ? (
                          <motion.textarea
                            key={`isNot-${category.key}-edit`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-16 text-sm"
                            value={(editableData.isNot && editableData.isNot[category.key]) || ''}
                            onChange={(e) => handleChange('isNot', category.key, e.target.value)}
                            placeholder={`${category.label} is not...`}
                          />
                        ) : (
                          <motion.p
                            key={`isNot-${category.key}-view`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-pre-wrap text-gray-700"
                          >
                            {(editableData.isNot && editableData.isNot[category.key]) || (
                              <span className="text-gray-400 italic">Not specified</span>
                            )}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </CardContainer>
  );
};

export default IsIsNotCard;