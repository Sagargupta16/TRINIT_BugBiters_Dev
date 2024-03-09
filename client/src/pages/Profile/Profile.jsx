import Structure from '../../components/Structure/Structure';
import './Profile.css';

import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe('pk_test_51OsIjoSDjkXJPjPFyeTkSbLIBKPzUUlaF2VDPoYG5ORqgg2t7om9MD3vjPUGCXn1Khap8NBc1ZhazAVitBlGSBcN00rntAB9vC')

const Profile = () => {
	// payment integration
	const handleClick = async () => {
		const course = {
			price: 100,
			currency: 'INR',
			quantity: 1,
			description: 'English Class'
		};

		const response = await fetch('http://localhost:5000/student/create-checkout-session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify(course)
		});

		const session = await response.json();

		console.log(session);

		const result = stripe.redirectToCheckout({
			sessionId: session.id
		});

		if (result.error) {
			console.error(result.error.message);
		}
	};

	const leftComponent = (
		<div className="profile">
			<div className="profile-info">
				<img src="https://via.placeholder.com/150" alt="Profile" className="profile-pic" />
				<h2 className="username">Username</h2>
				<p className="role">Role-(exp)</p>
			</div>
			<div className="profile-details">
				<h3 className="languages">Languages</h3>
				<p>English</p>
				<p>Spanish</p>
				<p>French</p>
			</div>
		</div>
	);

	const rightComponent = (
		<div className="profile-right">
			<div className="profile-right-top">
				<h3>Upcoming Classes</h3>
				<div className="upcoming-classes">
					<div>
						<h3>English Class</h3>
						<p>12/12/2021</p>
						<p>10:00 AM - 11:00 AM</p>
						<p>₹100</p>
						<button onClick={handleClick}>Join</button>
					</div>
					<div>
						<h3>English Class</h3>
						<p>12/12/2021</p>
						<p>10:00 AM - 11:00 AM</p>
						<p>₹100</p>
						<button>Join</button>
					</div>
					<div>
						<h3>English Class</h3>
						<p>12/12/2021</p>
						<p>10:00 AM - 11:00 AM</p>
						<p>₹100</p>
						<button>Join</button>
					</div>
				</div>
			</div>
			<div className="profile-right-top">
				<h3>Upcoming Classes</h3>
				<div className="upcoming-classes">
					<div>
						<h3>English Class</h3>
						<p>12/12/2021</p>
						<p>10:00 AM - 11:00 AM</p>
						<button>Join</button>
					</div>
					<div>
						<h3>English Class</h3>
						<p>12/12/2021</p>
						<p>10:00 AM - 11:00 AM</p>
						<button>Join</button>
					</div>
					<div>
						<h3>English Class</h3>
						<p>12/12/2021</p>
						<p>10:00 AM - 11:00 AM</p>
						<button>Join</button>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="container">
			<Structure LeftCompnonet={leftComponent} RightComponent={rightComponent} ContainerComponent={null} />
		</div>
	);
};

export default Profile;
