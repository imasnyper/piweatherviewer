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
		<div className="reading">
			{props.temperature}<br />
			{props.humidity}<br />
			{props.pressure}<br />
			{props.date_time}<br />
		</div>
	);
}

function Readings(props) {
	return (
		<div className="readings">
			{props.readings.map((elem, i) => {
				return (
					<Reading
						key={i}
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
	let imgStyle = 	{ 	maxWidth: props.width - 12
					}
	console.log(props.width);
	return (
		<div className='photo'>
			{props.photos.map((elem, i) => {
				return (<a title={elem.name} key={i}>
						<img 
							src={elem.location}  
							alt={elem.name}
							style={ imgStyle }>
						</img>
					   </a>)
			})}
		</div>
	)
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { width: 0, height: 0 }
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight})
	}

	render() {
		return (
			<div className='react-app'>
				<TestComponent test={window.props.test} />
				<Readings readings={window.props.readings} />
				<Photos photos={window.props.photos} width={this.state.width} />
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	window.react_mount,
)