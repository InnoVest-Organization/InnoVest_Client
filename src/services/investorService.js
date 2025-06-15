import axios from 'axios';

const BASE_URL = 'http://localhost:5006/api';

const investorApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getInvestorDetails = async (investorId) => {
    try {
        const response = await investorApi.get(`/investors/${investorId}`);
        return response.data;
    } catch (error) {
        console.error('Error in getInvestorDetails:', error);
        throw error;
    }
};

export const getInvestorProducts = async () => {
    try {
        const response = await investorApi.get('/inventions/products');
        return response.data;
    } catch (error) {
        console.error('Error in getInvestorProducts:', error);
        throw error;
    }
}; 