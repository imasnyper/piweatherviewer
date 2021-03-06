import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Readings } from '../components/readings';
import { ReadingChart } from '../components/readingChart';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import Navbar from '../components/navbar';

import 'react-datepicker/dist/react-datepicker.css';

class History extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			width: 0, 
			height: 0,
			tempMetric: true,
			pressureMetric: true,
			view: "hours",
			readings: [],
			chartReadings: [],
			startDate: moment.tz(moment(window.props.startDate, "YYYY-MM-DDTHH:mm:ss ZZ"), "UTC").local(),
			endDate: moment.tz(moment(window.props.endDate, "YYYY-MM-DDTHH:mm:ss ZZ"), "UTC").local(),
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.setView = this.setView.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.prepReadings = this.prepReadings.bind(this);
		this.groupBy = this.groupBy.bind(this);
		this.convertReadings = this.convertReadings.bind(this);
		this.toStandard = this.toStandard.bind(this);
		this.toMetric = this.toMetric.bind(this);
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
		this.limitReadings = this.limitReadings.bind(this);
	}

	handleClick(unit, e) {
		// 1: temp
		// 2: pressure
		// 3: both
		// convert just temp
		if (unit === 1){
			const tempMetric = !this.state.tempMetric;
			const pressureMetric = this.state.pressureMetric;
			const newReadings = this.convertReadings(
				this.limitReadings(this.state.readings), 1, tempMetric, pressureMetric);
			this.setState({
				tempMetric: tempMetric,
				readings: newReadings,
				chartReadings: this.prepReadings(newReadings, this.state.view)
			});
		} 
		// convert just pressure
		else if (unit === 2) {
			const tempMetric = this.state.tempMetric;
			const pressureMetric = !this.state.pressureMetric;
			let newReadings = this.convertReadings(
				this.limitReadings(this.state.readings), 2, tempMetric, pressureMetric);
			this.setState({
				pressureMetric: pressureMetric,
				readings: newReadings,
				chartReadings: this.prepReadings(newReadings, this.state.view),
			});
		}
		// convert both temperature and pressure
		else if (unit === 3) {
			const tempMetric = !this.state.tempMetric;
			const pressureMetric = !this.state.pressureMetric;
			const newReadings = this.convertReadings(
				this.limitReadings(this.state.readings), 3, tempMetric, pressureMetric);
			this.setState({
				tempMetric: tempMetric,
				pressureMetric: pressureMetric,
				readings: newReadings,
				chartReadings: this.prepReadings(newReadings, this.state.view),
			});
		}
	}

	handleChangeStart(date) {
		const d = date;
		this.setState({
			startDate: d,
			chartReadings: this.prepReadings(
				this.limitReadings(this.state.readings, d.valueOf()), this.state.view)
		});
	}

	handleChangeEnd(date) {
		const d = date;
		this.setState({
			endDate: d,
			chartReadings: this.prepReadings(
				this.limitReadings(this.state.readings, undefined, d.valueOf()), this.state.view)
		});
	}

	setView(view, e) {
		if (view === "minutes") {
			const view = "minutes";
			this.setState({
				view: view,
				chartReadings: this.prepReadings(
					this.limitReadings(this.state.readings), view),
			});
		} else if (view === "hours") {
			this.setState({
				view: "hours",
				chartReadings: this.prepReadings(
					this.limitReadings(this.state.readings), view),
			});
		} else if (view === "days") {
			this.setState({
				view: "days",
				chartReadings: this.prepReadings(
					this.limitReadings(this.state.readings), view),
			});
		}
	}

	convertReadings(readings, conversionType, tempMetric, pressureMetric) {
		let convertedReadings;
		if (conversionType === 1) {
			tempMetric ? 
				convertedReadings = this.toMetric(readings, conversionType) : 
				convertedReadings = this.toStandard(readings, conversionType);
		} else if (conversionType === 2) {
			pressureMetric ? 
				convertedReadings = this.toMetric(readings, conversionType) :
				convertedReadings = this.toStandard(readings, conversionType);
		} else {
			tempMetric ? 
				convertedReadings = this.toMetric(readings, 1) : 
				convertedReadings = this.toStandard(readings, 1);
			pressureMetric ? 
				convertedReadings = this.toMetric(convertedReadings, 2) :
				convertedReadings = this.toStandard(convertedReadings, 2);
		}

		return convertedReadings;
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

	limitReadings(readings, startDate, endDate) {
		let sD, eD;
		if (startDate === undefined) {
			sD = moment(this.state.endDate);
		} else {
			sD = moment(startDate);
		}
		if (endDate === undefined) {
			eD = moment(this.state.endDate);
		} else {
			eD = moment(endDate);
		}

		let newReadings = [];
		readings.forEach(reading => {
			let d = moment.tz(moment(reading.date_string, "YYYY-MM-DDTHH:mm:ss ZZ"), "UTC").local();
			if ( d > sD && d < eD ) {
				newReadings.push(reading);
			}
		});

		return newReadings
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		let readings = window.props.readings.slice();
		let chartReadings = this.prepReadings(this.limitReadings(readings), this.state.view);
		let eD = moment(this.state.endDate); //copy moment object
		console.log(eD);
		let sD = eD.subtract(7, "days").local();
		console.log(sD.format());
		console.log(eD.format());
		this.setState({
			readings: readings,
			chartReadings: chartReadings,
			startDate: sD,  // <======WTF
		});
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

	prepReadings(readings, view) {
		let data = readings.map((reading) => {
			const date = moment.tz(moment(reading.date_string, "YYYY-MM-DDTHH:mm:ss ZZ"), "UTC").local()
			const y = date.year();
			const m = date.month();
			const d = date.date();
			let newDate;
			if (view === "days") {
				newDate = moment([y, m, d]).valueOf();
			} else if (view === "hours") {
				const h = date.hours();
				newDate = moment([y, m, d, h]).valueOf();
			} else if (view === "minutes") {
				const h = date.hours();
				const min = date.minutes();
				newDate = moment([y, m, d, h, min]).valueOf();
			}
			return {
				date_time: newDate,
				temperature: reading.temperature,
				humidity: reading.humidity,
				pressure: reading.pressure
			};
		});

		data = data.reverse();
		// convert array of objects into array of dicts, with the date_time as the key
		data = this.groupBy(data, 'date_time'); 
		data = data.map((date_time) => {
			let temps = [];
			let humidities = [];
			let pressures = [];
			Object.values(date_time)[1].forEach((reading) => {
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

			return { date_time: Object.values(date_time)[0], temperature: tempAvg, humidity: humidityAvg, pressure: pressureAvg }
		});		

		return data;
	}

	render() {
		// if device width is less than 700 pixels, datepicker is stacked and not inline
		// otherwise, datepicker inline
		console.log(window.props.loggedIn);
		console.log(window.props.name);
		if (this.state.width < 700) {
			return (
				<div className='react-app'>
					<Navbar 
						debug={window.props.debug} 
						title={window.props.title} 
						loggedIn={window.props.loggedIn}
						name={window.props.name}
						width={this.state.width}>
					</Navbar>

					<div className="chart-date-wrapper">
						<div className="chart-controls">
							<span className="toggle-units" onClick={(e) => {this.handleClick(3, e)}}>Toggle Units</span>
							<select>
								<option onClick={(e) => {this.setView('hours', e)}}>Hours</option>
								<option onClick={(e) => {this.setView('days', e)}}>Days</option>
								<option onClick={(e) => {this.setView('minutes', e)}}>Minutes</option>
							</select>
						</div>
						<ReadingChart 
							data={this.state.chartReadings} 
							tempMetric={this.state.tempMetric} 
							pressureMetric={this.state.pressureMetric}
							view={this.state.view}
							width={this.state.width}
							clicks={this.handleClick}
						/>
						<div className="date-selection-mobile">
							<h4>Select a start and end date to limit the chart</h4>
							Select start date
							<DatePicker
							  selected={this.state.startDate}
							  selectsStart
							  showTimeSelect
							  startDate={this.state.startDate}
							  endDate={this.state.endDate}
							  onChange={this.handleChangeStart}
							/>
							Select end date
							<DatePicker
							  selected={this.state.endDate}
							  selectsEnd
							  showTimeSelect
							  startDate={this.state.startDate}
							  endDate={this.state.endDate}
							  onChange={this.handleChangeEnd}
							/>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className='react-app'>
					<Navbar 
						debug={window.props.debug}
						title={window.props.title}
						name={window.props.name}
						loggedIn={window.props.loggedIn}
						width={this.state.width}>
					</Navbar>
					<div className="chart-date-wrapper">
						<div className="chart-controls">
							<span className="toggle-units" onClick={(e) => {this.handleClick(3, e)}}>Toggle Units</span>
							<select>
								<option onClick={(e) => {this.setView('hours', e)}}>Hours</option>
								<option onClick={(e) => {this.setView('days', e)}}>Days</option>
								<option onClick={(e) => {this.setView('minutes', e)}}>Minutes</option>
							</select>
						</div>
						<ReadingChart 
							data={this.state.chartReadings} 
							tempMetric={this.state.tempMetric} 
							pressureMetric={this.state.pressureMetric}
							view={this.state.view}
							width={this.state.width}
							clicks={this.handleClick}
						/>
						<div className="date-selection">
							<table align="center">
								<caption>Select a start and end date to limit the chart</caption>
								<thead>
									<tr>
										<th>
											Select start date
										</th>
										<th>
											Select end date
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<DatePicker
											  selected={this.state.startDate}
											  selectsStart
											  showTimeSelect
											  inline
											  startDate={this.state.startDate}
											  endDate={this.state.endDate}
											  onChange={this.handleChangeStart}
											/>
										</td>
										<td>
											<DatePicker
											  selected={this.state.endDate}
											  selectsEnd
											  showTimeSelect
											  inline
											  startDate={this.state.startDate}
											  endDate={this.state.endDate}
											  onChange={this.handleChangeEnd}
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			);
		}
	}
}

ReactDOM.render(
	<History />,
	window.react_mount,
)