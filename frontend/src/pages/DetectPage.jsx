import React from 'react';
import UploadZone from '../components/UploadZone';
import { useNavigate } from 'react-router-dom';

export default function DetectPage() {
    const navigate = useNavigate();

    const handleResult = (data) => {
        navigate('/results', { state: { results: data } });
    };

    const handleClear = () => {
        // Clear handled inside component or we just redirect
    };

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <UploadZone onResult={handleResult} onClear={handleClear} />
        </div>
    );
}
