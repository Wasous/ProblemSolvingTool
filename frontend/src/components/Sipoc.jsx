import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardContainer from './CardContainer';

// Animation variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.07
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2
    }
  }
};

const SipocCard = ({ data, onSave, onDelete }) => {
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
    // Create a complete data object with editionMode explicitly set to false
    const updatedData = {
      ...editableData,
      editionMode: false
    };

    setEditionMode(false);
    setOriginalData(updatedData);

    // Ensure the complete data is passed to the parent component
    if (onSave) {
      onSave(updatedData);
    }
  };

  // Cancel edits
  const handleCancel = () => {
    setEditableData(originalData);
    setEditionMode(false);
  };

  // SIPOC categories
  const categories = [
    { label: 'Suppliers', key: 'suppliers', description: 'Who provides inputs to the process?', color: 'amber' },
    { label: 'Inputs', key: 'inputs', description: 'What inputs are required for the process?', color: 'green' },
    { label: 'Process', key: 'process', description: 'What are the steps in the process?', color: 'blue' },
    { label: 'Outputs', key: 'outputs', description: 'What results from the process?', color: 'indigo' },
    { label: 'Customers', key: 'customers', description: 'Who receives the outputs?', color: 'purple' }
  ];

  return (
    <CardContainer
      title={editableData.title || 'SIPOC Diagram'}
      type="SIPOC"
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
          key={editionMode ? 'edit-mode' : 'view-mode'}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.key}
              layout
              className="group"
              variants={itemVariants}
              custom={index}
              transition={{
                layout: {
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.5
                }
              }}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center bg-${category.color}-100 text-${category.color}-800 font-bold rounded-lg mr-3`}>
                  {category.label[0]}
                </div>
                <h3 className="text-md font-medium text-gray-800">{category.label}</h3>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {editionMode ? (
                  <motion.div
                    key={`${category.key}-edit`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 ml-11"
                  >
                    <textarea
                      value={editableData[category.key] || ''}
                      onChange={(e) => handleChange(category.key, e.target.value)}
                      className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-${category.color}-500/40 min-h-24 text-gray-700`}
                      placeholder={category.description}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${category.key}-view`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-2 ml-11 p-3 bg-gray-50 rounded-lg border border-gray-200 group-hover:border-${category.color}-200 transition-colors`}
                  >
                    {editableData[category.key] ? (
                      <p className="whitespace-pre-wrap text-gray-700">
                        {editableData[category.key]}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">No {category.label.toLowerCase()} specified</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </CardContainer>
  );
};

export default SipocCard;