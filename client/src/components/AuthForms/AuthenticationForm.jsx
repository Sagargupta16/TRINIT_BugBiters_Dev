import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signin, signup } from '../../api/authApi';
import ToastContent from '../ToastContent/ToastContent';
import ForgetPassword from './ForgetPassword';
import FormFooter from './FormFooter';
import classes from './auth.module.css';

const AuthenticationForm = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const isSignIn = params.get('mode') === 'signin';

	const handleSubmit = async (e) => {
		e.preventDefault();

		setName(
			name
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ')
		);

		const user = isSignIn
			? { email: email.toLowerCase(), password }
			: {
					name,
					email: email.toLowerCase(),
					password
				};

		try {
			const res = await (isSignIn ? signin(user) : signup(user));
			toast.success(<ToastContent res={isSignIn ? 'Sign In successful' : 'Sign Up successful'} messages={res.data.messages} />);
			if (isSignIn) {
				localStorage.setItem('token', res.data.data.token);
				navigate('/');
			} else navigate('/auth?mode=signin');
		} catch (err) {
			toast.error(<ToastContent res={isSignIn ? 'Sign In failed' : 'Sign Up failed'} messages={err.response.data.errors} />);
		}
	};

	const [showPassword, setShowPassword] = useState(false);

	const getEmailPassInput = () => {
		return (
			<>
				<div className={classes['auth-form__item']}>
					<label htmlFor="email">Email</label>
					<div className={classes['input-container']}>
						<input type="text" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} value={email} />
					</div>
				</div>
				<div className={classes['auth-form__item']}>
					<label htmlFor="password">Password</label>
					<div className={classes['input-container']}>
						<input type={showPassword ? 'text' : 'password'} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
						<button type="button" className={classes['password-toggle']} onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
					</div>
				</div>
			</>
		);
	};

	const signIn = () => {
		return (
			<>
				{getEmailPassInput()}
				<button type="submit" className={classes.btn}>
					Sign In
				</button>
				<ForgetPassword />
			</>
		);
	};

	const signUp = () => {
		return (
			<>
				<div className={classes['auth-form__item']}>
					<label htmlFor="name">Name</label>
					<input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
				</div>
				{getEmailPassInput()}

				<button type="submit" className={classes.btn}>
					Sign Up
				</button>
			</>
		);
	};

	return (
		<div className={classes['auth-form']}>
			<h1>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
			<form onSubmit={handleSubmit}>
				{isSignIn ? signIn() : signUp()}
				<FormFooter mode={isSignIn ? 'signup' : 'signin'} />
			</form>
		</div>
	);
};

export default AuthenticationForm;
