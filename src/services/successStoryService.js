const API_BASE_URL = 'http://localhost:5004/api/success-stories';

export const successStoryService = {
    // Fetch all success stories
    async getAllSuccessStories() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch success stories');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching success stories:', error);
            throw error;
        }
    },

    // Create a new success story
    async createSuccessStory(storyData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storyData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create success story');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating success story:', error);
            throw error;
        }
    },

    // Validate success story data
    validateStoryData(storyData) {
        const errors = [];
        
        if (!storyData.inventionId?.trim()) {
            errors.push('Invention ID is required');
        }
        
        if (!storyData.inventor_name?.trim()) {
            errors.push('Inventor name is required');
        }
        
        if (!storyData.message?.trim()) {
            errors.push('Success story message is required');
        }
        
        if (storyData.message?.length > 500) {
            errors.push('Success story message must be less than 500 characters');
        }
        
        if (storyData.profilePhoto && !this.isValidUrl(storyData.profilePhoto)) {
            errors.push('Profile photo must be a valid URL');
        }
        
        return errors;
    },

    // Helper function to validate URLs
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
};
