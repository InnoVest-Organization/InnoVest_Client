import axios from 'axios';

const BASE_URL = 'http://localhost:5004/api';

const biddingApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getBidsByInventionId = async (inventionId) => {
    try {
        const response = await biddingApi.get(`/bids/invention/${inventionId}`);
        return response.data;
    } catch (error) {
        console.error('Error in getBidsByInventionId:', error);
        throw error;
    }
};

export const placeBid = async (bidData) => {
    try {
        const response = await biddingApi.post('/bids', bidData);
        return response.data;
    } catch (error) {
        console.error('Error in placeBid:', error);
        throw error;
    }
};

export const acceptBid = async (orderId) => {
    try {
        // Use PATCH method with the correct endpoint
        const response = await biddingApi.patch('/bids/select', {
            orderId: orderId,
            selected: true
        });
        return response.data;
    } catch (error) {
        console.error('Error in acceptBid:', error);
        throw error;
    }
};
