import React, { useState } from 'react';
import {
    FaUser,
    FaCalendarAlt,
    FaTag,
    FaCheckCircle,
    FaClock,
    FaInfoCircle,
    FaListAlt,
    FaUsers,
    FaProjectDiagram,
    FaHome,
    FaClipboardList,
    FaFile,
    FaBuilding,
    FaTasks,
    FaQuestion
} from 'react-icons/fa';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Tabs from '@radix-ui/react-tabs';

const LeftPanel = ({
    project,
    currentStage
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null); // 'info', 'phases', 'team' or null

    if (!project) return null;

    // Handle tab selection
    const handleTabClick = (tab) => {
        if (activeTab === tab) {
            // If clicking the active tab, close the panel
            setIsOpen(false);
            setActiveTab(null);
        } else {
            // Otherwise, open the panel with the new tab
            setIsOpen(true);
            setActiveTab(tab);
        }
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

    // Tab for general project information
    const InfoTab = () => (
        <div className="space-y-6">
            {/* Project Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                        <FaUser className="mr-2" />
                        <span>{project.owner?.username || 'Unknown Owner'}</span>
                    </div>
                    <div className="flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                    </div>
                    <div className="flex items-center">
                        <FaClock className="mr-2" />
                        <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Project Description */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Description
                </h3>
                <p className="text-gray-600 text-sm">
                    {project.description || 'No description provided'}
                </p>
            </div>

            {/* Tags */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                        >
                            <FaTag className="mr-1" />
                            {tag.name}
                        </span>
                    ))}
                    {(!project.tags || project.tags.length === 0) && (
                        <span className="text-sm text-gray-400 italic">No tags</span>
                    )}
                </div>
            </div>
        </div>
    );

    // Tab for DMAIC phases
    const PhasesTab = () => (
        <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Phase Progress
            </h3>
            <div className="space-y-3">
                {['Define', 'Measure', 'Analyze', 'Improve', 'Control'].map(phase => (
                    <div
                        key={phase}
                        className={`p-3 rounded-lg ${currentStage === phase ? 'bg-blue-50 border border-blue-100' :
                            phaseProgress[phase]?.completed ? 'bg-green-50 border border-green-100' :
                                'bg-gray-50 border border-gray-100'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-700">{phase}</h4>
                            {phaseProgress[phase]?.completed && (
                                <FaCheckCircle className="text-green-500" />
                            )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                            {phase === currentStage ? 'Currently active' :
                                phaseProgress[phase]?.completed ? 'Completed' : 'Not started'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );

    // Tab for team information
    const TeamTab = () => (
        <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Project Team
            </h3>
            {/* This is a placeholder. You would replace this with actual team data */}
            <div className="space-y-4">
                {(project.teamMembers || []).map((member, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="font-bold text-blue-700">
                                {member.User ? getInitials(member.User.username) : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-800">{member.User?.username || 'Unknown User'}</h4>
                            <p className="text-sm text-gray-500">{member.role || 'Team Member'}</p>
                        </div>
                    </div>
                ))}
                {(!project.teamMembers || project.teamMembers.length === 0) && (
                    <p className="text-gray-500 italic">No team members assigned</p>
                )}
            </div>
        </div>
    );

    const FilesTab = () => (
        <div className="text-gray-600">
            <p>Project file management will be available here.</p>
        </div>
    );

    const TasksTab = () => (
        <div className="text-gray-600">
            <p>Project tasks and assignments will be available here.</p>
        </div>
    );

    const FAQsTab = () => (
        <div className="text-gray-600">
            <p>Common questions and answers about the project will be available here.</p>
        </div>
    );

    const HomeTab = () => (
        <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">My Feeds</h3>
                <p className="text-sm text-blue-600">Recent activity from your projects</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Announcements</h3>
                <p className="text-sm text-purple-600">Important updates from the team</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">Your recent notes and reminders</p>
            </div>
        </div>
    );

    return (
        <div className="fixed top-16 bottom-0 left-0 flex z-10">
            {/* Sidebar (always visible) */}
            <div className="w-20 bg-slate-900 text-white flex flex-col items-center pt-6 pb-2">
                {/* Project initials circle at the top */}
                <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center mb-6 shadow-md">
                    <span className="text-lg font-bold text-white">{getInitials(project.name)}</span>
                </div>

                {/* Navigation buttons using Radix Tabs */}
                <Tabs.Root
                    value={activeTab || 'home'}
                    onValueChange={(value) => handleTabClick(value)}
                    className="flex flex-col items-center space-y-1 w-full"
                >
                    <Tabs.List className="flex flex-col w-full">
                        <Tabs.Trigger
                            value="home"
                            className={`w-full py-3 flex flex-col items-center justify-center transition-colors ${activeTab === 'home' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}
                            title="Home"
                        >
                            <FaHome className="text-lg mb-1" />
                            <span className="text-xs">Home</span>
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="info"
                            className={`w-full py-3 flex flex-col items-center justify-center transition-colors ${activeTab === 'info' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}
                            title="Project Info"
                        >
                            <FaInfoCircle className="text-lg mb-1" />
                            <span className="text-xs">Info</span>
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="phases"
                            className={`w-full py-3 flex flex-col items-center justify-center transition-colors ${activeTab === 'phases' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}
                            title="Phases"
                        >
                            <FaProjectDiagram className="text-lg mb-1" />
                            <span className="text-xs">Phases</span>
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="team"
                            className={`w-full py-3 flex flex-col items-center justify-center transition-colors ${activeTab === 'team' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}
                            title="Team"
                        >
                            <FaUsers className="text-lg mb-1" />
                            <span className="text-xs">Team</span>
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="files"
                            className={`w-full py-3 flex flex-col items-center justify-center transition-colors ${activeTab === 'files' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}
                            title="Files"
                        >
                            <FaFile className="text-lg mb-1" />
                            <span className="text-xs">Files</span>
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="tasks"
                            className={`w-full py-3 flex flex-col items-center justify-center transition-colors ${activeTab === 'tasks' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}
                            title="Tasks"
                        >
                            <FaTasks className="text-lg mb-1" />
                            <span className="text-xs">Tasks</span>
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="faqs"
                            className={`w-full py-3 flex flex-col items-center justify-center transition-colors ${activeTab === 'faqs' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`}
                            title="FAQs"
                        >
                            <FaQuestion className="text-lg mb-1" />
                            <span className="text-xs">FAQs</span>
                        </Tabs.Trigger>
                    </Tabs.List>
                </Tabs.Root>
            </div>

            {/* Sliding panel using Radix Collapsible */}
            <Collapsible.Root
                open={isOpen}
                onOpenChange={setIsOpen}
                className={`bg-white shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}
            >
                <Collapsible.Content>
                    {isOpen && (
                        <div className="p-6 h-full overflow-y-auto">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                {activeTab === 'info' && 'Project Information'}
                                {activeTab === 'phases' && 'DMAIC Phases'}
                                {activeTab === 'team' && 'Project Team'}
                                {activeTab === 'home' && 'Dashboard'}
                                {activeTab === 'files' && 'Project Files'}
                                {activeTab === 'tasks' && 'Project Tasks'}
                                {activeTab === 'faqs' && 'FAQs'}
                            </h2>

                            {/* Tab Content */}
                            {activeTab === 'info' && <InfoTab />}
                            {activeTab === 'phases' && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                                        PHASE PROGRESS
                                    </h3>
                                    <div className="space-y-3">
                                        {['Define', 'Measure', 'Analyze', 'Improve', 'Control'].map(phase => {
                                            const isActive = phase === currentStage;
                                            const isCompleted = phaseProgress[phase]?.completed;
                                            const status = isCompleted ? 'Completed' : isActive ? 'Currently active' : 'Not started';

                                            return (
                                                <div
                                                    key={phase}
                                                    className={`p-4 rounded-lg ${isCompleted ? 'bg-green-50' :
                                                        isActive ? 'bg-blue-50' :
                                                            'bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-medium text-gray-800">{phase}</h4>
                                                        {isCompleted && (
                                                            <FaCheckCircle className="text-green-500 text-lg" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {status}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'team' && <TeamTab />}
                            {activeTab === 'home' && <HomeTab />}
                            {activeTab === 'files' && <FilesTab />}
                            {activeTab === 'tasks' && <TasksTab />}
                            {activeTab === 'faqs' && <FAQsTab />}
                        </div>
                    )}
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};

export default LeftPanel;