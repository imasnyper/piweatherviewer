import React from 'react';

const style = {
	cursor: 'pointer',
	userSelect: 'none',
}

export function Reading(props) {
	const year = props.date.getFullYear();
	const month = ("00" + (props.date.getMonth() + 1)).slice(-2);
	const day = ("00" + props.date.getDate()).slice(-2);
	const hour = ("00" + props.date.getHours()).slice(-2);
	const minute = ("00" + props.date.getMinutes()).slice(-2);
	const second = ("00" + props.date.getSeconds()).slice(-2);

	const temp_unit = props.tempMetric ? "C" : "F";
	const pressure_unit = props.pressureMetric ? "mbar" : "inHg";

	return (
		<div className="reading">
			<div className="temp" onClick={(e) => {props.onClick(1, e)}} style={style}>
				<span className="temp-number">
					{parseFloat(props.temperature).toFixed(2)}
				</span>
				<span className="temp-text">
					&deg;{temp_unit}
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
			<div className="pressure" onClick={(e) => {props.onClick(2, e)}} style={style}>
				<span className="pressure-number">
					{parseFloat(props.pressure).toFixed(2)}
				</span>
				<span className="pressure-text">
					&nbsp;{pressure_unit}
				</span>
			</div>
			<div className="reading-time">
				{year}-{month}-{day} {hour}:{minute}:{second}
			</div>
		</div>
	);
}

export function Readings(props) {
	return (
		<div className="readings">
			{props.readings.map((elem, i) => {
				const d = new Date(elem.date_string);
				return (
					<Reading
						key={i}
						temperature={elem.temperature}
						humidity={elem.humidity}
						pressure={elem.pressure}
						date={d}
						tempMetric={props.tempMetric}
						pressureMetric={props.pressureMetric}
						onClick={props.onClick}>
					</Reading>
				)
			})}
		</div>
	)
}