import axiosInstance from './axiosInstance';

export const checkToken = () => axiosInstance.get('/token-check');
