import PropTypes from 'prop-types';
import './ToastContent.css';

const ToastContent = ({ res, messages }) => (
	<div className="toast-content">
		<h3 className="toast-res">{res}</h3>
		<div className="toast-messages">
			{messages.map((message) => (
				<div key={message} className="toast-message">
					{message}
				</div>
			))}
		</div>
	</div>
);

ToastContent.propTypes = {
	res: PropTypes.string.isRequired,
	messages: PropTypes.array.isRequired
};

export default ToastContent;
