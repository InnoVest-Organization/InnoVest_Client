import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui';
import { Plus } from 'lucide-react';
import SuccessStoryList from './SuccessStoryList';
import SuccessStoryForm from './SuccessStoryForm';

const SuccessStorySection = () => {
    const [successStories, setSuccessStories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const formRef = useRef(null);

    // Fetch success stories on component mount and when refreshTrigger changes
    useEffect(() => {
        fetchSuccessStories();
    }, [refreshTrigger]);

    const fetchSuccessStories = async () => {
        try {
            const response = await fetch('http://localhost:5007/api/story');
            if (response.ok) {
                const data = await response.json();
                setSuccessStories(data);
            } else {
                console.error('Failed to fetch success stories');
            }
        } catch (error) {
            console.error('Error fetching success stories:', error);
        }
    };

    const handleFormSubmitSuccess = () => {
        setShowForm(false);
        setRefreshTrigger(prev => prev + 1); // Trigger refresh
    };

    const handleFormCancel = () => {
        setShowForm(false);
    };

    const handleAddStoryClick = () => {
        setShowForm(true);
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Focus on the first input field (Invention ID)
                const firstInput = formRef.current.querySelector('input[name="inventionId"]');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        }, 100); // Small delay to ensure form is rendered
    };

    return (
        <div className="mb-16">
            {/* Section Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Success Stories</h2>
            </div>

            {/* Success Stories List */}
            <SuccessStoryList stories={successStories} refreshTrigger={refreshTrigger} />

            <div className="text-center mb-10">
                <Button
                    onClick={handleAddStoryClick}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2 mx-auto"
                >
                    <Plus className="h-4 w-4" />
                    Add Your Story
                </Button>
            </div>

            {/* Add Success Story Form */}
            {showForm && (
                <div ref={formRef} className="mt-16">
                    <SuccessStoryForm
                        onSubmitSuccess={handleFormSubmitSuccess}
                        onCancel={handleFormCancel}
                    />
                </div>
            )}
        </div>
    );
};

export default SuccessStorySection;
