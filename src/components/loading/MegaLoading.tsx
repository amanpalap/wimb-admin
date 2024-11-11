import React from 'react';
import { FaBus } from 'react-icons/fa';

const LoadMegaLoadinging = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <FaBus className="text-6xl text-blue-500 animate-bounce" />
            <p className="mt-4 text-lg text-gray-300">Loading, please wait...</p>
        </div>
    );
};

export default LoadMegaLoadinging;
