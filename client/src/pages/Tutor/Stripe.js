import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe('pk_test_51OsIjoSDjkXJPjPFyeTkSbLIBKPzUUlaF2VDPoYG5ORqgg2t7om9MD3vjPUGCXn1Khap8NBc1ZhazAVitBlGSBcN00rntAB9vC');

const Stripe = async ({ price, description }) => {
	const course = {
		price: price,
		currency: 'INR',
		quantity: 1,
		description: description
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

	const result = stripe.redirectToCheckout({
		sessionId: session.id
	});

	if (result.error) {
		console.error(result.error.message);
	}

	console.log(result);
	return result;
};

export default Stripe;
