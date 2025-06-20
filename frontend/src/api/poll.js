import axios from 'axios';
import { API_URL } from '../api.js';

export const fetchActivePoll = async () => {
    const res = await axios.get(`${API_URL}/active`);
    return res.data;
}

export const createPoll = async (pollData) => {
    const res = await axios.post(`${API_URL}/`, pollData);
    return res.data;
};

export const submitAnswer = async (pollId, optionIdx) => {
    const res = await axios.post(`${API_URL}/${pollId}/answer`, { optionIdx });
    return res.data;
};

export const fetchPollHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/history`);
        return response.data;
    } catch (error) {
        console.error('Error fetching poll history:', error);
        return [];
    }
};