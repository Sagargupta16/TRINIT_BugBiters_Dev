import axiosInstance from './axiosInstance';

export const signup = (user) => {
	return axiosInstance.post('/auth/signup', user);
};

export const signin = (user) => {
	return axiosInstance.post('/auth/login', user);
};

export const forgotPassword = (email) => {
	return axiosInstance.post('/auth/verify-email', email);
};

export const verifyOTP = (email, otp) => {
	return axiosInstance.post('/auth/verify-otp', email, otp);
};

export const resetPassword = (email, otp, password) => {
	return axiosInstance.post('/auth/reset-password', email, otp, password);
};
