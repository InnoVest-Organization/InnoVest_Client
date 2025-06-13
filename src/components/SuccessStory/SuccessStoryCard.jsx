import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { User, Quote } from 'lucide-react';

const SuccessStoryCard = ({ story }) => {
    return (
        <Card className="min-w-[300px] max-w-[300px] shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                    {story.profilePhoto ? (
                        story.profilePhoto.startsWith('http') ? (
                            <img
                                src={story.profilePhoto}
                                alt={story.inventorName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={`http://localhost:5007/api/story/download/${story.profilePhoto}`}
                                alt={story.inventorName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error("Image failed to load:", story.profilePhoto);
                                    e.target.src = "fallback-image-url.jpg"; // Optional fallback
                                }}
                            />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                        </div>
                    )}
                </div>
                <CardTitle className="text-lg">{story.inventorName}</CardTitle>
                <p className="text-sm text-gray-500">Invention ID: {story.inventionId}</p>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-3">
                    <Quote className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-gray-700 text-center italic">"{story.message}"</p>
                {story.investorId && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                        Investor: {story.investorId}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default SuccessStoryCard;
