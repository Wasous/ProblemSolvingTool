
/**
 * Determines the current phase of a DMAIC project based on its stages
 * @param {Array} stages - Array of DMAIC stage objects
 * @returns {String} The current phase name
 */
export const getCurrentPhase = (stages) => {
    // If no stages data is provided, return N/A
    if (!stages || !Array.isArray(stages) || stages.length === 0) {
        return "N/A";
    }
    
    // Sort stages in the correct DMAIC order
    const correctOrder = ['Define', 'Measure', 'Analyze', 'Improve', 'Control'];
    const sortedStages = [...stages].sort((a, b) => 
        correctOrder.indexOf(a.stage_name) - correctOrder.indexOf(b.stage_name)
    );
    
    // Find the first incomplete stage from the sorted list
    const current = sortedStages.find(stage => 
        stage && stage.stage_name && stage.completed === false
    );
    
    // If found, return its name, otherwise check if all stages are properly completed
    if (current) {
        return current.stage_name;
    }
    
    // Check if all expected stages exist and are completed
    const allStagesCompleted = correctOrder.every(expectedStage => 
        stages.some(stage => stage.stage_name === expectedStage && stage.completed === true)
    );
    
    return allStagesCompleted ? "Completed" : "Define";
};

/**
 * Sorts DMAIC stages in the correct order
 * @param {Array} stages - Array of DMAIC stage objects
 * @returns {Array} Sorted array of stages
 */
export const sortDmaicStages = (stages) => {
    if (!stages || !Array.isArray(stages)) return [];
    
    const correctOrder = ['Define', 'Measure', 'Analyze', 'Improve', 'Control'];
    return [...stages].sort((a, b) => 
        correctOrder.indexOf(a.stage_name) - correctOrder.indexOf(b.stage_name)
    );
};