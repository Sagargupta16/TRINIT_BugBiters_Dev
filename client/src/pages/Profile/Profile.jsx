import { useEffect, useState } from 'react';
import { MdOutlineModeEdit } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { updateUser } from '../../api/userApi';
import ToastContent from '../../components/ToastContent/ToastContent';
import getUserData from '../../utils/user.js';
import './Profile.css';

const Profile = () => {
	const [user, setUser] = useState({});
	const [isEditing, setIsEditing] = useState('');
	const [isEdited, setIsEdited] = useState(false);
	const [prevUser, setPrevUser] = useState({});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await getUserData();
				setUser(user);
				setPrevUser(user);
			} catch (err) {
				console.log(err);
			}
		};
		fetchUser();
	}, []);

	const handleInputChange = (name, value) => {
		setUser((prevState) => ({
			...prevState,
			[name]: value
		}));
		setIsEdited(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateUser(user.id, user);
			setIsEditing('');
			toast.success(<ToastContent res="success" messages={['Profile updated successfully.']} />);
			setIsEdited(false);
			setPrevUser(user);
		} catch (error) {
			console.log(error.response.data.message);
			toast.error(<ToastContent res="error" messages={[error.response.data.message]} />);
		}
	};

	const onCancel = () => {
		const input = document.getElementById(isEditing);
		input.disabled = true;
		setIsEditing('');
	};

	const inputRenderer = (name, value) => {
		return (
			<input
				type="text"
				name={name}
				value={value}
				id={name}
				onChange={(e) => handleInputChange(name, e.target.value)}
				disabled={isEditing !== name}
			/>
		);
	};

	const fieldRenderer = (editable, label, name, value) => {
		return (
			<div className="item">
				<label htmlFor={name}>{label}</label>
				{inputRenderer(name, value)}
				{editable && (
					<button onClick={() => (isEditing === name ? onCancel() : setIsEditing(name))}>
						{isEditing === name ? <RxCross1 /> : <MdOutlineModeEdit />}
					</button>
				)}
			</div>
		);
	};

	const buttons = () => {
		return (
			<div className="profile-buttons">
				<button onClick={handleSubmit} className="btn btn-primary">
					Update Changes
				</button>
				<button
					onClick={() => {
						setIsEdited(false);
						setUser(prevUser);
					}}
					className="btn btn-primary"
				>
					Discard Changes
				</button>
			</div>
		);
	};

	return (
		<div className="container">
			<h1>My Profile</h1>
			{Object.keys(user).length !== 0 && (
				<div className="profile">
					<div className="profile-items">
						<div className="item-group">
							<h2>Personal Information</h2>
							{fieldRenderer(false, 'Name', 'Name', user.name)}
							{fieldRenderer(false, 'Email', 'email', user.email)}
						</div>
						{isEdited && buttons()}
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
