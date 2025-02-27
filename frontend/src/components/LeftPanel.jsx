import React, { useState, useEffect } from 'react';
import {
    FaHome,
    FaInfoCircle,
    FaProjectDiagram,
    FaUsers,
    FaFile,
    FaTasks,
    FaQuestion,
    FaChevronLeft,
    FaTag,
    FaCalendarAlt,
    FaClock,
    FaUser,
    FaCheckCircle
} from 'react-icons/fa';
import * as Tabs from '@radix-ui/react-tabs';

const LeftPanel = ({ project, currentStage, isOpen, setIsOpen }) => {
    // Keep track of the active tab, initially null (no tab selected)
    const [activeTab, setActiveTab] = React.useState(null);
    // State to control when to show the close button
    const [showCloseButton, setShowCloseButton] = useState(false);

    // Effect to handle the close button appearance after panel animation completes
    useEffect(() => {
        let timer;
        if (isOpen) {
            // Show the close button after the panel animation completes (300ms)
            timer = setTimeout(() => {
                setShowCloseButton(true);
            }, 300);
        } else {
            // Hide the close button immediately when panel starts closing
            setShowCloseButton(false);
        }

        return () => clearTimeout(timer);
    }, [isOpen]);

    if (!project) return null;

    // Maintain the original toggle behavior
    const handleTabClick = (tab) => {
        if (activeTab === tab) {
            // If clicking the active tab, close the panel and deselect the tab
            setIsOpen(false);
            setActiveTab(null);
        } else {
            // If clicking a different tab, open the panel and select that tab
            setIsOpen(true);
            setActiveTab(tab);
        }
    };

    // Close panel function
    const handleClosePanel = () => {
        setIsOpen(false);
        setActiveTab(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const calculatePhaseProgress = (stages) => {
        if (!stages || stages.length === 0) return {};

        const progress = {
            Define: { completed: false, data: {} },
            Measure: { completed: false, data: {} },
            Analyze: { completed: false, data: {} },
            Improve: { completed: false, data: {} },
            Control: { completed: false, data: {} }
        };

        stages.forEach(stage => {
            if (stage.data) {
                progress[stage.stage_name] = {
                    completed: stage.completed,
                    data: stage.data
                };
            }
        });

        return progress;
    };

    const phaseProgress = calculatePhaseProgress(project.dmaicStages);

    // Navigation items
    const navItems = [
        { id: 'home', label: 'Home', icon: FaHome },
        { id: 'info', label: 'Info', icon: FaInfoCircle },
        { id: 'phases', label: 'Phases', icon: FaProjectDiagram },
        { id: 'team', label: 'Team', icon: FaUsers },
        { id: 'files', label: 'Files', icon: FaFile },
        { id: 'tasks', label: 'Tasks', icon: FaTasks },
        { id: 'faqs', label: 'FAQs', icon: FaQuestion }
    ];

    return (
        <div className="fixed top-16 bottom-0 left-0 flex z-40">
            {/* Sidebar Navigation */}
            <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm">
                {/* Navigation Tabs */}
                <div className="flex flex-col w-full gap-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`
                                w-full py-3 flex flex-col items-center justify-center 
                                transition-all duration-200 relative outline-none border-none focus:outline-none focus:ring-0 rounded-none
                                ${activeTab === item.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-900 bg-transparent hover:bg-transparent focus:bg-transparent'}
                            `}
                            title={item.label}
                        >
                            <item.icon className="text-xl" />
                            <span className="text-xs mt-1">{item.label}</span>
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Panel */}
            <div className={`
                bg-white border-r border-gray-200 shadow-md 
                transition-all duration-300 overflow-hidden
                ${isOpen ? 'w-72' : 'w-0'}
            `}>
                {isOpen && (
                    <>
                        {/* Close button with transition */}
                        <button
                            onClick={handleClosePanel}
                            className={`
                                absolute top-3 right-3 text-gray-500 hover:text-gray-700 
                                p-1 rounded-full hover:bg-gray-100
                                transition-opacity duration-200
                                ${showCloseButton ? 'opacity-100' : 'opacity-0'}
                            `}
                            title="Close panel"
                            aria-hidden={!showCloseButton}
                            tabIndex={showCloseButton ? 0 : -1}
                        >
                            <FaChevronLeft size={16} />
                        </button>

                        <div className="p-5 h-full overflow-y-auto pt-12">
                            {/* Use Radix UI Tabs only when a tab is selected */}
                            {activeTab && (
                                <Tabs.Root value={activeTab} defaultValue={activeTab}>
                                    <Tabs.Content value="home">
                                        <HomeTabContent />
                                    </Tabs.Content>

                                    <Tabs.Content value="info">
                                        <InfoTabContent project={project} formatDate={formatDate} />
                                    </Tabs.Content>

                                    <Tabs.Content value="phases">
                                        <PhasesTabContent phaseProgress={phaseProgress} currentStage={currentStage} />
                                    </Tabs.Content>

                                    <Tabs.Content value="team">
                                        <TeamTabContent project={project} />
                                    </Tabs.Content>

                                    <Tabs.Content value="files">
                                        <FilesTabContent />
                                    </Tabs.Content>

                                    <Tabs.Content value="tasks">
                                        <TasksTabContent />
                                    </Tabs.Content>

                                    <Tabs.Content value="faqs">
                                        <FAQsTabContent />
                                    </Tabs.Content>
                                </Tabs.Root>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Home Tab Content
const HomeTabContent = () => (
    <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Dashboard</h2>
        <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-1 flex items-center">
                    <FaHome className="text-indigo-500 mr-2" />
                    Activity Feed
                </h3>
                <p className="text-sm text-gray-600">Recent project updates will appear here</p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <h3 className="font-medium text-indigo-700 mb-1">Quick Stats</h3>
                <p className="text-sm text-indigo-600">Project metrics overview</p>
            </div>
        </div>
    </div>
);

// Info Tab Content
const InfoTabContent = ({ project, formatDate }) => (
    <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Project Information</h2>

        <div className="mb-5 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
                <FaUser className="text-gray-400 mr-2" />
                <span className="font-medium text-gray-700 mr-1">Owner:</span>
                <span>{project.owner?.username || 'Unknown'}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <span className="font-medium text-gray-700 mr-1">Timeline:</span>
                <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
                <FaClock className="text-gray-400 mr-2" />
                <span className="font-medium text-gray-700 mr-1">Updated:</span>
                <span>{formatDate(project.updatedAt)}</span>
            </div>
        </div>

        <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">Description</h3>
            <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md border border-gray-200">
                {project.description || 'No description provided'}
            </p>
        </div>

        <div>
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
                {project.tags && project.tags.length > 0 ? (
                    project.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                        >
                            <FaTag className="mr-1 text-indigo-400" size={10} />
                            {tag.name}
                        </span>
                    ))
                ) : (
                    <span className="text-sm text-gray-400 italic">No tags</span>
                )}
            </div>
        </div>
    </div>
);

// Phases Tab Content
const PhasesTabContent = ({ phaseProgress, currentStage }) => (
    <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">DMAIC Phases</h2>

        <div className="space-y-3">
            {['Define', 'Measure', 'Analyze', 'Improve', 'Control'].map(phase => {
                const isActive = phase === currentStage;
                const isCompleted = phaseProgress[phase]?.completed;

                return (
                    <div
                        key={phase}
                        className={`p-3 rounded-lg border transition-colors ${isCompleted
                            ? 'bg-green-50 border-green-200'
                            : isActive
                                ? 'bg-indigo-50 border-indigo-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${isCompleted
                                    ? 'bg-green-100 text-green-600'
                                    : isActive
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {isCompleted ? (
                                        <FaCheckCircle className="text-green-500" />
                                    ) : (
                                        <span>{phase[0]}</span>
                                    )}
                                </div>
                                <h3 className={`font-medium ${isCompleted
                                    ? 'text-green-700'
                                    : isActive
                                        ? 'text-indigo-700'
                                        : 'text-gray-700'
                                    }`}>
                                    {phase}
                                </h3>
                            </div>

                            <span className={`text-xs px-2 py-1 rounded-full ${isCompleted
                                ? 'bg-green-100 text-green-800'
                                : isActive
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-gray-200 text-gray-700'
                                }`}>
                                {isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}
                            </span>
                        </div>

                        {isActive && (
                            <div className="mt-2 text-xs text-indigo-600 italic">
                                Current phase in progress
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);

// Team Tab Content
const TeamTabContent = ({ project }) => {
    const getInitials = (name) => {
        if (!name) return 'N/A';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Project Team</h2>

            <div className="space-y-3">
                {(project.teamMembers || []).length > 0 ? (
                    project.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${member.role === 'Owner'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-gray-200 text-gray-700'
                                }`}>
                                {member.User ? getInitials(member.User.username) : 'N/A'}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">{member.User?.username || 'Unknown User'}</h4>
                                <p className={`text-xs ${member.role === 'Owner'
                                    ? 'text-indigo-600'
                                    : 'text-gray-500'
                                    }`}>
                                    {member.role || 'Team Member'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-500 italic">No team members assigned</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Files Tab Content
const FilesTabContent = () => (
    <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Project Files</h2>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">File management coming soon</p>
        </div>
    </div>
);

// Tasks Tab Content
const TasksTabContent = () => (
    <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Project Tasks</h2>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Task assignments coming soon</p>
        </div>
    </div>
);

// FAQs Tab Content
const FAQsTabContent = () => (
    <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">FAQs</h2>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Project FAQs coming soon</p>
        </div>
    </div>
);

export default LeftPanel;