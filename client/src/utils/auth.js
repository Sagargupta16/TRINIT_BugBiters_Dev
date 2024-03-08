import { redirect } from 'react-router-dom';
import { checkToken } from '../api/tokenCheckApi';

const verifyToken = async (token) => {
	try {
		const response = await checkToken(token);
		if (!response.data.isAuthenticated) return false;
		const exp = JSON.parse(atob(token.split('.')[1])).exp;
		return exp > Date.now() / 1000;
	} catch (error) {
		return false;
	}
};

export const getAuthToken = async () => {
	const token = localStorage.getItem('token');
	if (!token) return null;
	const isAuthenticated = await verifyToken(token);
	if (!isAuthenticated) {
		localStorage.removeItem('token');
		return null;
	}
	return token;
};

export const checkAuthAction = async () => {
	const token = await getAuthToken();
	if (!token) return redirect('/auth?mode=signin');
	return null;
};
