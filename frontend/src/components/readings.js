import React from 'react';

export function Reading(props) {
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
				{props.date_time}
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
						year={elem.year}
						month={elem.month}
						day={elem.day}
						hour={elem.hour}
						minute={elem.minute}
						second={elem.second}>
					</Reading>
				)
			})}
		</div>
	)
}