import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Readings } from '../components/readings';
import { Photos } from '../components/photos';
import { ReadingChart } from '../components/readingChart';

class History extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			width: 0, 
			height: 0,
			metricUnits: true,
			tempMetric: true,
			pressureMetric: true,
			view: "hours",
			readings: [],
			chartReadings: [],
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.prepReadings = this.prepReadings.bind(this);
		this.groupBy = this.groupBy.bind(this);
		this.convertReadings = this.convertReadings.bind(this);
		this.toStandard = this.toStandard.bind(this);
		this.toMetric = this.toMetric.bind(this);
	}

	handleClick(unit, e) {
		// 1: temp
		// 2: pressure
		// 3: both
		// convert just temp
		if (unit === 1){
			let newReadings = this.convertReadings(this.state.readings, 1)
			this.setState({
				tempMetric: !this.state.tempMetric,
				readings: newReadings,
				chartReadings: this.prepReadings(newReadings)
			});
		} 
		// convert just pressure
		else if (unit === 2) {
			let newReadings = this.convertReadings(this.state.readings, 2)
			this.setState({
				pressureMetric: !this.state.pressureMetric,
				readings: newReadings,
				chartReadings: this.prepReadings(newReadings),
			});
		}
		// convert both temperature and pressure
		else if (unit === 3) {
			if(this.state.tempMetric === this.state.pressureMetric) {
				if(this.state.tempMetric === this.state.metricUnits) {
					// temperature and pressure units are both equal to global units - swap everything
					let newReadings = this.convertReadings(this.state.readings, 3)
					this.setState({
						metricUnits: !this.state.metricUnits,
						tempMetric: !this.state.tempMetric,
						pressureMetric: !this.state.pressureMetric,
						readings: newReadings,
						chartReadings: this.prepReadings(newReadings),
					});
				}
				else {
					let mu = !this.state.metricUnits
					this.setState({
						metricUnits: mu,
						tempMetric: !this.state.tempMetric,
						pressureMetric: !this.state.pressureMetric
					});
				}
			} else {
				let mu = !this.state.metricUnits;
				this.setState({
					metricUnits: mu,
					tempMetric: mu,
					pressureMetric: mu,
				});
			}
		}
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		let readings = window.props.readings.slice();
		this.setState({
			readings: readings,
			chartReadings: this.prepReadings(readings),
		});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight})
	}

	convertReadings(readings, conversionType) {
		if (conversionType === 3) {
			if (this.state.tempMetric === this.state.pressureMetric) {
				this.state.tempMetric ? readings = this.toStandard(readings, conversionType) : readings = this.toMetric(readings, conversionType);
			} else {
				this.state.tempMetric ? readings = this.toStandard(readings, 1) : readings = this.toMetric(readings, 1);
				this.state.pressureMetric ? readings = this.toStandard(readings, 2) : readings = this.toMetric(readings, 2);
			}
		} else if (conversionType === 2) {
			this.state.pressureMetric ? readings = this.toStandard(readings, 2) : readings = this.toMetric(readings, 2);
		} else {
			this.state.tempMetric ? readings = this.toStandard(readings, 1) : readings = this.toMetric(readings, 1);
		}

		return readings
	}

	toStandard(readings, conversionType) {
		let temp, pressure, temp_unit, pressure_unit;

		if(conversionType === 3){
			readings = readings.map(reading => {
				return {
					date_string: reading.date_string,
					temperature: reading.temperature * 9 / 5 + 32,
					humidity: reading.humidity,
					pressure: reading.pressure / 33.86388101478402,
				};
			});
		} else if (conversionType === 1) {
			readings = readings.map(reading => {
				return {
					date_string: reading.date_string,
					temperature: reading.temperature * 9 / 5 + 32,
					humidity: reading.humidity,
					pressure: reading.pressure,
				};
			});
		} else if (conversionType === 2) {
			readings = readings.map(reading => {
				return {
					date_string: reading.date_string,
					temperature: reading.temperature,
					humidity: reading.humidity,
					pressure: reading.pressure / 33.86388101478402,
				};
			});
		}
		return readings
	}

	toMetric(readings, conversionType) {
		let temp, pressure, temp_unit, pressure_unit;

		if(conversionType === 3){
			readings = readings.map(reading => {
				return {
					date_string: reading.date_string,
					temperature: (reading.temperature - 32) * 5 / 9,
					humidity: reading.humidity,
					pressure: reading.pressure * 33.86388101478402,
				};
			});
		} else if (conversionType === 1) {
			readings = readings.map(reading => {
				return {
					date_string: reading.date_string,
					temperature: (reading.temperature - 32) * 5 / 9,
					humidity: reading.humidity,
					pressure: reading.pressure,
				};
			});
		} else if (conversionType === 2) {
			readings = readings.map(reading => {
				return {
					date_string: reading.date_string,
					temperature: reading.temperature,
					humidity: reading.humidity,
					pressure: reading.pressure * 33.86388101478402,
				};
			});
		}
		return readings
	}

	groupBy(xs, key) {
		return xs.reduce((rv, x) => {
			let v = key instanceof Function ? 
				key(x) :
				x[key];
			let el = rv.find((r) => r && r.key === v);
			if(el) {
				el.values.push(x);
			} else {
				rv.push({ key: v, values: [x] });
			}
			return rv;
		}, []);
	}

	prepReadings(readings) {
		let data = readings.map((reading) => {
			const date = new Date(reading.date_string)
			const y = date.getFullYear();
			const m = date.getMonth();
			const d = date.getDate();
			const h = date.getHours();
			const newDate = new Date(y, m, d, h).valueOf();
			return {
				date_time: newDate,
				temperature: reading.temperature,
				humidity: reading.humidity,
				pressure: reading.pressure
			};
		});

		data = data.reverse();
		data = this.groupBy(data, 'date_time');
		data = data.map((hour) => {
			let temps = [];
			let humidities = [];
			let pressures = [];
			Object.values(hour)[1].forEach((reading) => {
				temps.push(reading.temperature);
				humidities.push(reading.humidity);
				pressures.push(reading.pressure)
			});
			let tempSum = temps.reduce((a, b) => {return a + b})
			let humiditySum = humidities.reduce((a, b) => {return a + b})
			let pressureSum = pressures.reduce((a, b) => {return a + b})
			let tempAvg = tempSum / temps.length;
			let humidityAvg = humiditySum / humidities.length;
			let pressureAvg = pressureSum / pressures.length;

			return { date_time: Object.values(hour)[0], temperature: tempAvg, humidity: humidityAvg, pressure: pressureAvg }
		});		

		return data;
	}

	render() {
		const updatedReadings = this.state.chartReadings.slice();
		const tempData = [{date_time: new Date().valueOf(), temperature: 23, humidity: 68, pressure: 1018}]
		return (
			<div className='react-app'>
				<button type="button" onClick={(e) => {this.handleClick(3, e)}}>Toggle</button>
				<ReadingChart data={this.state.chartReadings} />
				<Readings 
					readings={this.state.readings} 
					tempMetric={this.state.tempMetric}
					pressureMetric={this.state.pressureMetric}
					onClick={this.handleClick}
				/>
				<Photos photos={window.props.photos} width={this.state.width} />
			</div>
		);
	}
}

ReactDOM.render(
	<History />,
	window.react_mount,
)