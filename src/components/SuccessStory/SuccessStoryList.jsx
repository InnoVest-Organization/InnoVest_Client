import React, { useState, useEffect } from 'react';
import { Button } from './ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SuccessStoryCard from './SuccessStoryCard';

const SuccessStoryList = () => {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('http://localhost:5007/api/story');
                if (response.ok) {
                    const data = await response.json();
                    setStories(data);
                } else {
                    setStories([]);
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setStories([]);
            }
        };
        fetchStories();
    }, []);

    const scrollContainer = (direction) => {
        const container = document.getElementById('stories-container');
        const scrollAmount = 320;
        if (container) {
            if (direction === 'left') {
                container.scrollLeft -= scrollAmount;
            } else {
                container.scrollLeft += scrollAmount;
            }
        }
    };

    return (
        <div className="relative">
            <Button
                onClick={() => scrollContainer('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-600 shadow-lg rounded-full w-10 h-10 p-0"
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <div
                id="stories-container"
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {stories.length > 0 ? (
                    stories.map((story, index) => (
                        <SuccessStoryCard key={index} story={story} />
                    ))
                ) : (
                    <div className="w-full text-center py-12">
                        <p className="text-gray-500 text-lg">No success stories yet. Be the first to share yours!</p>
                    </div>
                )}
            </div>
            <Button
                onClick={() => scrollContainer('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-gray-600 shadow-lg rounded-full w-10 h-10 p-0"
            >
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default SuccessStoryList;