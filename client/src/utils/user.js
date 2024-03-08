import { jwtDecode } from 'jwt-decode';
import { getUser } from '../api/userApi';
import { getAuthToken } from './auth';

const getUserData = async () => {
	const token = await getAuthToken();
	try {
		const decodedToken = jwtDecode(token);
		const user = await getUser(decodedToken.id);
		user.data.id = decodedToken.id;
		return user.data;
	} catch (error) {
		console.error('Error decoding token:', error.message);
		return null;
	}
};

export default getUserData;
