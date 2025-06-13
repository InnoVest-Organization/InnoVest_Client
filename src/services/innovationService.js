import axios from 'axios';

const INNOVATION_API_URL = 'http://localhost:5002/api/inventions';

export const getInnovationsByInventor = async (inventorId) => {
    try {
        const response = await axios.get(`${INNOVATION_API_URL}/inventor/${inventorId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch innovations');
    }
};

export const createInnovation = async (innovationData) => {
    try {
        const response = await axios.post(INNOVATION_API_URL, innovationData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to create innovation');
    }
};

export const getInnovationDetail = async (inventionId) => {
    const response = await fetch(`http://localhost:5002/api/inventions/${inventionId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch innovation details');
    }
    return response.json();
};
