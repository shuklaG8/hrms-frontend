import axios from 'axios';

const api = axios.create({
    // baseURL: `${import.meta.env.VITE_API_KEY}/api/`,
    baseURL: `https://hrms-backend-gtjd.onrender.com/api/`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
