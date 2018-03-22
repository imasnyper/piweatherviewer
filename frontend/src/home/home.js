import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Reading } from '../components/readings';
import { Photos } from '../components/photos';
import moment from 'moment';

function Toggle(props) {
	return 
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			width: 0, 
			height: 0,
			metricUnits: true,
			tempMetric: true,
			pressureMetric: true,
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(unit, e) {
		// 1: temp
		// 2: pressure
		// 3: both
		console.log(unit);
		if (unit === 1){
			this.setState({
				tempMetric: !this.state.tempMetric,
			});
		} 
		else if (unit === 2) {
			this.setState({
				pressureMetric: !this.state.pressureMetric,
			});
		}
		else if (unit === 3) {
			let mu = !this.state.metricUnits;
			this.setState({
				metricUnits: mu,
				tempMetric: mu,
				pressureMetric: mu,
			});
		}
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
		const d = new Date(window.props.reading.date_string);
		return (
			<div className='react-app'>
				<Reading
					temperature={window.props.reading.temperature}
					humidity={window.props.reading.humidity}
					pressure={window.props.reading.pressure}
					date={d}
					tempMetric={this.state.tempMetric}
					pressureMetric={this.state.pressureMetric}
					onClick={this.handleClick}>
				</Reading>
				<button type='button' onClick={(e) => this.handleClick(3, e)}>Toggle</button>
				<Photos photos={window.props.photos} width={this.state.width}/>
			</div>
		);
	}
}

ReactDOM.render(
	<Home />,
	window.react_mount,
)