import axios from 'axios';

const INNOVATOR_API_URL = 'http://localhost:5001/api/innovator';
const INVENTION_API_URL = 'http://localhost:5002/api/inventions';
const API_URL = 'http://localhost:5002/api';

export const getInnovatorProfile = async (id) => {
    try {
        const response = await axios.get(`${INNOVATOR_API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateInnovatorProfile = async (id, data) => {
    try {
        const response = await axios.patch(`${INNOVATOR_API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        // Remove console.logs and just throw the error with the message
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           error.message;
        
        throw new Error(errorMessage);
    }
};

export const getInnovatorInventions = async (id) => {
    try {
        const response = await axios.get(`${INVENTION_API_URL}/inventor/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateBidTimes = async (inventionId, bidStartTime, bidEndTime, bidStartDate) => {
    try {
        // Format validation
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        
        // Ensure times are in HH:mm:ss format
        const formatTime = (time) => {
            if (!time) return '';
            // If time is in HH:mm format, add :00
            if (time.length === 5) {
                return `${time}:00`;
            }
            // If time is in HH:mm:ss format, ensure seconds are 00
            if (time.length === 8) {
                return `${time.substring(0, 6)}00`;
            }
            return time;
        };

        const formattedStartTime = formatTime(bidStartTime);
        const formattedEndTime = formatTime(bidEndTime);

        if (!timeRegex.test(formattedStartTime) || !timeRegex.test(formattedEndTime)) {
            throw new Error('Time must be in HH:mm:ss format (e.g., "10:00:00")');
        }

        // Match the exact format that works in Postman
        const requestBody = {
            inventionId: Number(inventionId),
            bidStartTime: formattedStartTime,
            bidEndTime: formattedEndTime,
            bidStartDate: bidStartDate
        };

        console.log('Request body:', requestBody);

        const response = await axios.put(
            `${INVENTION_API_URL}/updateBidTimes`,
            requestBody
        );

        if (response.status !== 200) {
            throw new Error(`Server returned status ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error('Bid time update error:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
            
            const errorMessage = error.response.data.message || 
                               error.response.data.error || 
                               'Failed to update bid times';
            throw new Error(errorMessage);
        } else if (error.request) {
            console.error('Error request:', error.request);
            throw new Error('No response received from server');
        } else {
            console.error('Error message:', error.message);
            throw error;
        }
    }
};