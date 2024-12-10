import axios from 'axios';

const URL_API = 'http://localhost:5550/api'

const axiosInstance = axios.create({
    baseURL: URL_API,
});

export default axiosInstance;