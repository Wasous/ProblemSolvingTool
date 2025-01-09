import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreateForm from '../components/CreateForm';

const CreateProject = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-20">
            <Header title="Create New Project" />

            {/* Main Content */}


            <Footer />
        </div>
    );
};

export default CreateProject;
