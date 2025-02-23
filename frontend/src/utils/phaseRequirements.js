export const getPhaseRequirements = (stage) => {
    switch (stage) {
        case 'Define':
            return [
                { id: 'problem', label: 'Problem Statement', required: true },
                { id: 'scope', label: 'Project Scope', required: true },
                { id: 'impact', label: 'Business Impact', required: true },
                { id: 'stakeholders', label: 'Stakeholder Analysis', required: false },
                { id: 'team', label: 'Team Definition', required: true },
            ];
        case 'Measure':
            return [
                { id: 'metrics', label: 'Current Metrics', required: true },
                { id: 'data-plan', label: 'Data Collection Plan', required: true },
                { id: 'process', label: 'Process Mapping', required: true },
                { id: 'variables', label: 'Key Variables', required: false },
            ];
        case 'Analyze':
            return [
                { id: 'root-cause', label: 'Root Cause Analysis', required: true },
                { id: 'data-analysis', label: 'Data Analysis', required: true },
                { id: 'validation', label: 'Cause Validation', required: true },
                { id: 'opportunities', label: 'Improvement Opportunities', required: false },
            ];
        case 'Improve':
            return [
                { id: 'solutions', label: 'Solution Development', required: true },
                { id: 'implementation', label: 'Implementation Plan', required: true },
                { id: 'pilot', label: 'Pilot Testing', required: true },
                { id: 'results', label: 'Implementation Results', required: true },
            ];
        case 'Control':
            return [
                { id: 'control-plan', label: 'Control Plan', required: true },
                { id: 'monitoring', label: 'Monitoring System', required: true },
                { id: 'documentation', label: 'Process Documentation', required: true },
                { id: 'handover', label: 'Handover Plan', required: true },
            ];
        default:
            return [];
    }
};

export const getPhaseDescription = (stage) => {
    switch (stage) {
        case 'Define':
            return "Define the problem clearly, establish the project scope, and identify stakeholders. Focus on understanding the current situation and its business impact.";
        case 'Measure':
            return "Collect baseline data to understand the current process performance. Establish key metrics and create a comprehensive data collection plan.";
        case 'Analyze':
            return "Identify root causes through data analysis and validation. Focus on understanding why the problem exists and what factors contribute to it.";
        case 'Improve':
            return "Develop and implement solutions that address the root causes. Test solutions through pilots and measure their effectiveness.";
        case 'Control':
            return "Establish controls to maintain improvements and prevent regression. Document new processes and create monitoring systems.";
        default:
            return "";
    }
};

export const getRecommendedTools = (stage) => {
    switch (stage) {
        case 'Define':
            return [
                { id: 'sipoc', name: 'SIPOC Diagram', description: 'Map high-level process elements' },
                { id: 'is-is-not', name: 'IS/IS NOT Analysis', description: 'Define problem boundaries' },
                { id: 'stakeholder', name: 'Stakeholder Matrix', description: 'Analyze stakeholder interests' },
            ];
        case 'Measure':
            return [
                { id: 'process-map', name: 'Process Map', description: 'Detailed process visualization' },
                { id: 'data-collection', name: 'Data Collection Plan', description: 'Structured data gathering' },
                { id: 'pareto', name: 'Pareto Chart', description: 'Identify significant factors' },
            ];
        case 'Analyze':
            return [
                { id: 'fishbone', name: 'Fishbone Diagram', description: 'Cause and effect analysis' },
                { id: 'five-why', name: '5 Why Analysis', description: 'Deep dive into root causes' },
                { id: 'hypothesis', name: 'Hypothesis Testing', description: 'Validate potential causes' },
            ];
        case 'Improve':
            return [
                { id: 'solution-matrix', name: 'Solution Matrix', description: 'Evaluate solution options' },
                { id: 'impact-effort', name: 'Impact/Effort Matrix', description: 'Prioritize solutions' },
                { id: 'pilot-plan', name: 'Pilot Test Plan', description: 'Test solution effectiveness' },
            ];
        case 'Control':
            return [
                { id: 'control-chart', name: 'Control Chart', description: 'Monitor process stability' },
                { id: 'sop', name: 'Standard Operating Procedures', description: 'Document new process' },
                { id: 'reaction-plan', name: 'Reaction Plan', description: 'Define response to issues' },
            ];
        default:
            return [];
    }
};