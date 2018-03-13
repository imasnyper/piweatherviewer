import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function TestComponent(props) {
	console.log(props.test);
	return (
		<div>
			{props.test}<br />
			also hello world
		</div>
	);
}

function Reading(props) {
	return (
		<div>
			{props.temperature}<br />
			{props.humidity}<br />
			{props.pressure}<br />
			{props.date_time}<br />
		</div>
	);
}

function Readings(props) {
	return (
		<div>
			{props.readings.map((elem, i) => {
				return (
					<Reading
						temperature={elem.temperature}
						humidity={elem.humidity}
						pressure={elem.pressure}
						date_time={elem.date_time}>
					</Reading>
				)
			})}
		</div>
	)
}

function Photos(props) {
	return (
		<div>
			{props.photos.map((elem, i) => {
				return <img src={elem} key={i}></img>
			})}
		</div>
	)
}

class App extends Component {
	render() {
		return (
			<div>
				<TestComponent test={window.props.test} />
				<Readings readings={window.props.readings} />
				<Photos photos={window.props.photos} />
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	window.react_mount,
)