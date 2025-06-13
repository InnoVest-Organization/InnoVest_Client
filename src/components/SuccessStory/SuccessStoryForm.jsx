import React, { useState } from 'react';
import {
    Card, CardContent, CardHeader, CardTitle, Button, Input, Label
} from './ui';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const SuccessStoryForm = ({ onSubmitSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [formData, setFormData] = useState({
        inventionId: '',
        inventorName: '',
        investorId: '',
        message: '',
        profilePhoto: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('file', file);

        setUploadingPhoto(true);

        try {
            const response = await fetch('http://localhost:5007/api/story/upload', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                const fileName = await response.text();
                setFormData(prev => ({
                    ...prev,
                    profilePhoto: fileName
                }));
                toast.success('Photo uploaded successfully');
            } else {
                toast.error('Failed to upload photo');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            toast.error('Photo upload failed');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.inventionId || !formData.inventorName || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        // Log the form data
        console.log('Submitting form data:', formData);
        try {
            const payload = {
                inventionId: formData.inventionId,
                inventorName: formData.inventorName,
                investorId: formData.investorId,
                message: formData.message,
                profilePhoto: formData.profilePhoto
            };

            const response = await fetch('http://localhost:5007/api/story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success('Success story added!');
                setFormData({
                    inventionId: '',
                    inventorName: '',
                    investorId: '',
                    message: '',
                    profilePhoto: ''
                });
                onSubmitSuccess();

                // Refresh the page after successful submission
                setTimeout(() => {
                    window.location.reload();
                }, 1500); // Wait 1.5 seconds to show the success message
            } else {
                toast.error('Failed to submit story');
            }
        } catch (error) {
            console.error('Error submitting story:', error);
            toast.error('Failed to submit success story');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Share Your Success Story</CardTitle>
                <p className="text-gray-600 text-center">
                    Inspire other inventors by sharing your journey with InnoVest
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="inventionId">Invention ID *</Label>
                            <Input
                                id="inventionId"
                                name="inventionId"
                                type="text"
                                placeholder="Enter your invention ID"
                                value={formData.inventionId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="inventorName">Your Name *</Label>
                            <Input
                                id="inventorName"
                                name="inventorName"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.inventorName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="investorId">Investor ID (Optional)</Label>
                            <Input
                                id="investorId"
                                name="investorId"
                                type="text"
                                placeholder="Enter investor ID if applicable"
                                value={formData.investorId}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Label htmlFor="profilePhoto">Profile Photo</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="relative">
                                    <Input
                                        id="photoUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={uploadingPhoto}
                                        className="flex items-center gap-1"
                                    >
                                        <Upload className="h-4 w-4" />
                                        {uploadingPhoto ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </div>
                                {formData.profilePhoto && (
                                    <span className="text-sm text-gray-700">
                    {formData.profilePhoto}
                  </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="message">Your Success Story *</Label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            placeholder="Share your experience with InnoVest."
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex gap-4 justify-end">
                        <Button type="button" onClick={onCancel} variant="outline" className="px-6">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 px-6">
                            {isLoading ? 'Submitting...' : 'Submit Story'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default SuccessStoryForm;
