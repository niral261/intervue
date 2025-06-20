import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const fetchChatMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}/chat/messages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        return [];
    }
};

export const createChatMessage = async (messageData) => {
    try {
        const response = await axios.post(`${API_URL}/chat/messages`, messageData);
        return response.data;
    } catch (error) {
        console.error('Error creating chat message:', error);
        return null;
    }
}; 