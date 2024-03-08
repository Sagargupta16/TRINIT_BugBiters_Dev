import { useNavigate } from 'react-router-dom';
import classes from './VideoCall.module.css';

const VideoCall = () => {
	const navigate = useNavigate();
	const SubmitHandler = (event) => {
		event.preventDefault();
        console.log('SubmitHandler');
		const roomId = document.getElementById('room-id').value;
		return navigate(`/room/${roomId}`);
	};

	return (
		<div className="container">
			<h1>VideoCall</h1>

			<h3>Enter room ID</h3>
			<input type="text" id="room-id" className={classes['room-id']} />
			<button id="join-room" className={classes['btn']} onClick={SubmitHandler}>
				Join Room
			</button>
		</div>
	);
};

export default VideoCall;
