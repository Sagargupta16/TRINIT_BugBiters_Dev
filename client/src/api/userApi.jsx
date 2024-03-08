import axiosInstance from './axiosInstance';

export const getUsers = () => axiosInstance.get('/users/view');

export const getUser = (id) => axiosInstance.get(`/users/view/${id}`);

export const updateUser = (id, user) => axiosInstance.put(`/users/update/${id}`, user);

export const deleteUser = (id) => axiosInstance.delete(`/users/delete/${id}`);
