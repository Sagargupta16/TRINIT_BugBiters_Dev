import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword, verifyOTP } from '../../api/authApi';
import Modal from '../Modal/Modal';
import ToastContent from '../ToastContent/ToastContent';
import classes from './auth.module.css';

const ForgetPassword = () => {
	const [counter, setCounter] = useState(0);
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);

	const onConfirmAction = async () => {
		if (counter === 0) {
			try {
				const res = await forgotPassword({ email });
				toast.success(<ToastContent res="Email Sent" messages={res.data.messages} />);
				setCounter(counter + 1);
			} catch (err) {
				toast.error(<ToastContent res="Email Sending Failed" messages={err.response.data.errors} />);
			}
		} else if (counter === 1) {
			try {
				const res = await verifyOTP({ email, otp });
				toast.success(<ToastContent res="OTP Verified" messages={res.data.messages} />);
				setCounter(counter + 1);
			} catch (err) {
				toast.error(<ToastContent res="OTP Verification Failed" messages={err.response.data.errors} />);
			}
		} else {
			try {
				const res = await resetPassword({ email, otp, newPassword });
				toast.success(<ToastContent res="Password Reset Successful" messages={res.data.messages} />);
				setIsFormOpen(false);
			} catch (err) {
				toast.error(<ToastContent res="Password Reset Failed" messages={err.response.data.errors} />);
			}
		}
	};

	const [message, setMessage] = useState('Enter your College Email ID!!');
	const [buttonTitle, setButtonTitle] = useState('Send Email');
	const [inputType, setInputType] = useState('email');
	const [inputPlaceholder, setInputPlaceholder] = useState('Enter your email');
	const [inputValue, setInputValue] = useState(email);

	useEffect(() => {
		if (counter === 0) {
			setMessage('Enter your College Email ID!!');
			setButtonTitle('Send Email');
			setInputType('email');
			setInputPlaceholder('Enter your email');
			setInputValue(email);
		} else if (counter === 1) {
			setMessage('Check your email for OTP');
			setButtonTitle('Verify OTP');
			setInputType('number');
			setInputPlaceholder('Enter OTP');
			setInputValue(otp);
		} else {
			setMessage('Enter your new password');
			setButtonTitle('Reset Password');
			setInputType(showPassword ? 'text' : 'password');
			setInputPlaceholder('Enter new password');
			setInputValue(newPassword);
		}
	}, [counter, email, newPassword, otp, showPassword]);

	const inputRender = () => {
		return (
			<div className={classes['input-container']}>
				<input
					type={inputType}
					placeholder={inputPlaceholder}
					onChange={(e) => {
						if (counter === 0) setEmail(e.target.value);
						else if (counter === 1) setOtp(e.target.value);
						else setNewPassword(e.target.value);
					}}
					value={inputValue}
					id="input"
					autoFocus
				/>
				{counter === 2 && (
					<button className={classes['password-toggle']} onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				)}
			</div>
		);
	};

	return (
		<>
			<button className={classes['forgot-password']} onClick={() => setIsFormOpen(true)} type="button">
				Forgot Password?
			</button>
			{isFormOpen && (
				<Modal
					isOpen={isFormOpen}
					onClose={() => {
						setCounter(0);
						setIsFormOpen(false);
					}}
					onConfirm={() => onConfirmAction()}
					message={message}
					buttonTitle={buttonTitle}
					HasInput={() => inputRender()}
				/>
			)}
		</>
	);
};

export default ForgetPassword;
