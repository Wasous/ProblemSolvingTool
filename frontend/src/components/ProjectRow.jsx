// components/ProjectCard.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProjectCardBase from './shared/ProjectCardBase';

const ProjectCard = ({ project, projectId, isOwner }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <ProjectCardBase
            project={project}
            isOwner={isOwner}
            showExpanded={expanded}
            onExpand={() => setExpanded(!expanded)}
        />
    );
};

ProjectCard.propTypes = {
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool,
};

export default ProjectCard;