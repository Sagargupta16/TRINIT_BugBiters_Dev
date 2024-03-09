import axiosInstance from "./axiosInstance";

export const getClasses = () => axiosInstance.get("/class/view");

export const getClass = (id) => axiosInstance.get(`/class/view/${id}`);

export const updateClass = (id, classItem) =>
  axiosInstance.put(`/class/update/${id}`, classItem);

export const deleteClass = (id) => axiosInstance.delete(`/class/delete/${id}`);

export const createClass = (classItem) =>
  axiosInstance.post("/class/create", classItem);
