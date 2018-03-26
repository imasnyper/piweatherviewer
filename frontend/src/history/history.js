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
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.prepReadings = this.prepReadings.bind(this);
		this.groupBy = this.groupBy.bind(this);
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
			if(this.state.tempMetric === this.state.pressureMetric) {
				if(this.state.tempMetric === this.state.metricUnits) {
					this.setState({
						metricUnits: !this.state.metricUnits,
						tempMetric: !this.state.tempMetric,
						pressureMetric: !this.state.pressureMetric,
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
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight})
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
		// console.log(data);
		data = data.map((hour) => {
			let temps = [];
			let humidities = [];
			let pressures = [];
			Object.values(hour)[1].forEach((reading) => {
				temps.push(reading.temperature);
				humidities.push(reading.humidity);
				pressures.push(reading.pressure)
			});
			// console.log(Object.values(hour)[0]);
			// console.log("temps: ");
			// console.log(temps);
			// console.log("humidities: ");
			// console.log(humidities);
			// console.log("pressures: ");
			// console.log(pressures);
			// console.log("temps sum: ");
			let tempSum = temps.reduce((a, b) => {return a + b})
			// console.log(tempSum);
			// console.log("humidities sum: ");
			let humiditySum = humidities.reduce((a, b) => {return a + b})
			// console.log(humiditySum);
			// console.log("pressures sum: ");
			let pressureSum = pressures.reduce((a, b) => {return a + b})
			// console.log(pressureSum);
			// console.log("temps avg: ");
			let tempAvg = tempSum / temps.length;
			// console.log(tempAvg);
			let humidityAvg = humiditySum / humidities.length;
			// console.log(humidityAvg);
			let pressureAvg = pressureSum / pressures.length;
			// console.log(pressureAvg);

			return { date_time: Object.values(hour)[0], temperature: tempAvg, humidity: humidityAvg, pressure: pressureAvg }
		});
			

		return data;
		// }
	}

	render() {
		let chartXAxis;
		const readings = window.props.readings;
		let chartData = this.prepReadings(readings);
		console.log(chartData);
		return (
			<div className='react-app'>
				<button type="button" onClick={(e) => {this.handleClick(3, e)}}>Toggle</button>
				<ReadingChart data={chartData} />
				<Readings 
					readings={readings} 
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