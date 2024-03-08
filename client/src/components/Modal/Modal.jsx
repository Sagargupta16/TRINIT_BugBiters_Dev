import PropType from 'prop-types';
import ReactDOM from 'react-dom';
import classes from './Modal.module.css';

const Modal = ({ isOpen, onClose, onConfirm, message, buttonTitle, HasInput = null, rootid = 'modal-root' }) => {
	if (!isOpen) return null;
	return ReactDOM.createPortal(
		<div className="overlay">
			<div className={classes.modal}>
				<p>{message}</p>
				{HasInput && <HasInput />}
				<div className={classes['modal__buttons']}>
					<button className="btn btn-danger" onClick={onConfirm}>
						{buttonTitle}
					</button>
					<button className="btn btn-primary" onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</div>,
		document.getElementById(rootid)
	);
};

Modal.propTypes = {
	isOpen: PropType.bool.isRequired,
	onClose: PropType.func.isRequired,
	onConfirm: PropType.func.isRequired,
	message: PropType.string.isRequired,
	buttonTitle: PropType.string.isRequired,
	HasInput: PropType.func,
	rootid: PropType.string
};

export default Modal;
