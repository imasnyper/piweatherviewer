import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Reading } from '../components/readings';
import moment from 'moment-timezone';
import { Photos } from '../components/photos';
import Navbar from '../components/navbar';
import axios from 'axios';

function Toggle(props) {
	return 
}

export default class Home extends Component {
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
			photo_date: moment(window.props.photo.name.substring(6, 21), "DD-MM-YY_HHmmss"),
			hasError: false,
			duration: 0,
			visible: true,
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.toggleVis = this.toggleVis.bind(this);
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

	toggleVis(e) {
		let vis = this.state.visible
		this.setState({visible: !vis});
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
		console.log(info);
		this.setState({
			hasError: true,
		});
	}

	componentDidMount() {
		// 2018-06-05T21:06:01
		let d = moment.tz(moment(this.state.date_string, "YYYY-MM-DDTHH:mm:ss ZZ"), "UTC").local();
		let now = moment.tz(moment(), "UTC").local();
		let duration = moment.duration(now.diff(d));
		this.updateWindowDimensions();
		this.setState({
			duration: duration.asSeconds(),
		});
		this.timerID = setInterval( () => 
			this.tick(),
			1000
		);
		this.reloadTimerID = setInterval( () => 
			this.reload(),
			1000 * 60 * 5
		)
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
		clearInterval(this.timerID);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight})
	}

	tick() {
		let d = moment.tz(moment(this.state.date_string, "YYYY-MM-DDTHH:mm:ss ZZ"), "UTC").local();
		let now = moment.tz(moment(), "UTC").local();
		let duration = moment.duration(now.diff(d));
		this.setState({
			duration: duration.asSeconds(),
		})
	}

	reload() {
		window.location.reload()
	}

	render() {
		let readingStyle, appStyle;
	
		if (this.state.width < 768) {
			readingStyle = {
					left: "50%", 
					top: "50%", 
					transform: "translate(-50%, -50%)",
				}
		}
		else {
			readingStyle = 	{
				left: "50px", 
				bottom: "50px",
			}
		}
		if (!this.state.visible) {
			appStyle = {
				display: "none",
			}
		}
		if (this.state.hasError) {
			return <h1>Something Went Wrong</h1>
		}
		return (
			<div className='react-app'>
				<div className="components" style={appStyle}>
					<Navbar 
						debug={window.props.debug} 
						title={window.props.title}
						loginURL={window.props.loginURL}
						logInOut={window.props.logInOut}
						name={window.props.name}
						width={this.state.width}
					>
					</Navbar>
					<Reading
						temperature={this.state.temperature}
						humidity={this.state.humidity}
						pressure={this.state.pressure}
						date={this.state.duration}
						tempMetric={this.state.tempMetric}
						pressureMetric={this.state.pressureMetric}
						onClick={this.handleClick}
						width={this.state.width}
						style={readingStyle}>
					</Reading>
					<div className="image-description">
						{this.state.photo_date.tz("America/Toronto").format("LT z")}
					</div>
				</div>
				<div className="bg-photo" onClick={this.toggleVis} style={{backgroundImage: "url(" + window.props.photo.location + ")"}}></div>
			</div>
		);
	}
}

ReactDOM.render(
	<Home />,
	window.react_mount,
)