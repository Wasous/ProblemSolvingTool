import React, { useState } from 'react';
import HeaderProject from '../components/HeaderProject';
import Footer from '../components/Footer';
import CreateForm from '../components/CreateForm';

const CreateProject = () => {
        return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-20">
            <HeaderProject title="Create New Project" />

            {/* Main Content */}
            <CreateForm/>

            <Footer />
        </div>
    );
};

export default CreateProject;
