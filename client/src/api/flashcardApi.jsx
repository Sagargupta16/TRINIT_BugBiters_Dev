import axiosInstance from "./axiosInstance";

export const getFlashcardRoute = (id, language) => {
  return axiosInstance.post(`/flashcard/get/${id}`, { language: language });
};

export const createFlashcardRoute = (id, flashcard) => {
  return axiosInstance.post(`/flashcard/create/${id}`, flashcard);
};
