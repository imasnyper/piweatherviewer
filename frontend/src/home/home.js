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
			tempMetric: true,
			pressureMetric: true,
			temperature: window.props.reading.temperature,
			humidity: window.props.reading.humidity,
			pressure: window.props.reading.pressure,
			date_string: window.props.reading.date_string,
			hasError: false,
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.convertReading = this.convertReading.bind(this);
		this.toMetric = this.toMetric.bind(this);
		this.toStandard = this.toStandard.bind(this);
	}

	handleClick(unit, e) {
		// 1: temp
		// 2: pressure
		// 3: both
		// convert just temp
		if (unit === 1){
			const tempMetric = !this.state.tempMetric;
			const pressureMetric = this.state.pressureMetric;
			this.setState({
				tempMetric: tempMetric,
				temperature: this.convertReading(this.state.temperature, 1, tempMetric, pressureMetric),
			});
		} 
		// convert just pressure
		else if (unit === 2) {
			const tempMetric = this.state.tempMetric;
			const pressureMetric = !this.state.pressureMetric;
			this.setState({
				pressureMetric: pressureMetric,
				pressure: this.convertReading(this.state.pressure, 2, tempMetric, pressureMetric),
			});
		}
		// convert both temperature and pressure
		else if (unit === 3) {
			const tempMetric = !this.state.tempMetric;
			const pressureMetric = !this.state.pressureMetric;
			this.setState({
				tempMetric: tempMetric,
				pressureMetric: pressureMetric,
				temperature: this.convertReading(this.state.temperature, 1, tempMetric, pressureMetric),
				pressure: this.convertReading(this.state.pressure, 2, tempMetric, pressureMetric),
			});
		}
	}

	convertReading(reading, conversionType, tempMetric, pressureMetric) {
		let convertedReading;
		if (conversionType === 1) {
			tempMetric ? 
				convertedReading = this.toMetric(reading, conversionType) : 
				convertedReading = this.toStandard(reading, conversionType);
		} else if (conversionType === 2) {
			pressureMetric ? 
				convertedReading = this.toMetric(reading, conversionType) :
				convertedReading = this.toStandard(reading, conversionType);
		} else {
			tempMetric ? 
				convertedReading = this.toMetric(reading, 1) : 
				convertedReading = this.toStandard(reading, 1);
			pressureMetric ? 
				convertedReading = this.toMetric(convertedReading, 2) :
				convertedReading = this.toStandard(convertedReading, 2);
		}

		return convertedReading;
	}

	toStandard(reading, conversionType) {
		let newReading;

		if (conversionType === 1) {
			newReading = reading * 9 / 5 + 32;
		} else if (conversionType === 2) {
			newReading = reading / 33.86388101478402;
		}

		return newReading;
	}

	toMetric(reading, conversionType) {
		let newReading;

		if (conversionType === 1) {
			newReading = (reading - 32) * 5 / 9;
		} else if (conversionType === 2) {
			newReading = reading * 33.86388101478402;
		}
		return newReading;
	}

	componentDidCatch(error, info) {
		this.setState({
			hasError: true,
		});
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
		if (this.state.hasError) {
			return <h1>Something Went Wrong</h1>
		}
		return (
			<div className='react-app'>
				<Reading
					temperature={this.state.temperature}
					humidity={this.state.humidity}
					pressure={this.state.pressure}
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