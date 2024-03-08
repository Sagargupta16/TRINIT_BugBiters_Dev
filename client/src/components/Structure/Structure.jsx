import propTypes from 'prop-types';
import './Structure.css';

const Structure = ({ LeftCompnonet, RightComponent, ContainerComponent }) => {
	return (
		<div className="structure-container">
			{ContainerComponent}
			<div className="structure-left">{LeftCompnonet}</div>
			<div className="structure-right">{RightComponent}</div>
		</div>
	);
};

Structure.propTypes = {
	LeftCompnonet: propTypes.element.isRequired,
	RightComponent: propTypes.element.isRequired,
	ContainerComponent: propTypes.element.isRequired
};

export default Structure;
