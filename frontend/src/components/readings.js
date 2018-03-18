import React from 'react';

export function Reading(props) {
	const d = new Date(props.date_string)
	return (
		<div className="reading">
			<div className="temp">
				<span className="temp-number">
					{parseFloat(props.temperature).toFixed(2)}
				</span>
				<span className="temp-text">
					&deg;C
				</span>
			</div>
			<div className="humidity">
				<span className="humidity-number">
					{parseFloat(props.humidity).toFixed(2)}
				</span>
				<span className="humidity-text">
					% Humidity
				</span>
			</div>
			<div className="pressure">
				<span className="pressure-number">
					{parseFloat(props.pressure).toFixed(0)}
				</span>
				<span className="pressure-text">
					 mbar
				</span>
			</div>
			<div className="reading-time">
				{d}
			</div>
		</div>
	);
}

export function Readings(props) {
	return (
		<div className="readings">
			{props.readings.map((elem, i) => {
				return (
					<Reading
						key={i}
						temperature={elem.temperature}
						humidity={elem.humidity}
						pressure={elem.pressure}
						date_string={elem.date_string}>
					</Reading>
				)
			})}
		</div>
	)
}