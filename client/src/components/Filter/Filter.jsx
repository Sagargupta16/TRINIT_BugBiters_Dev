import propTypes from 'prop-types';
import './Filter.css';

const Filter = ({ Allptions, optionClickHandler }) => {
	const optionsRenderer = (head, options) => {
		return (
			<div className="filter__item">
				<div className="filter__item__label">{head}</div>
				<div className="filter__item__values">
					{options.map((option) => (
						<button
							key={option.value}
							id={`${head.toLowerCase()}-${option.value}`}
							className="filter__item__value"
							onClick={() => optionClickHandler(head, option.value)}
						>
							{option.label}
						</button>
					))}
				</div>
			</div>
		);
	};
	return (
		<div className="filter">
			<h3>Filters</h3>
			{Object.keys(Allptions).map((key) => optionsRenderer(key, Allptions[key]))}
		</div>
	);
};

Filter.propTypes = {
	Allptions: propTypes.object.isRequired,
	optionClickHandler: propTypes.func.isRequired
};

export default Filter;
