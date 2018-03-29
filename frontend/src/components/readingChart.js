import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';
import PropTypes from 'prop-types';

class CustomTooltip extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { active } = this.props;
		const temp_unit = this.props.tempMetric ? "C" : "F";
		const pressure_unit = this.props.pressureMetric ? "mbar" : "inHg";
		if (active) {
		  const { payload, label } = this.props;
		  console.log(payload)
		  return (
		    <div className="custom-tooltip">
		      <p className="label">{`Date: ${moment(label).format("M/D/YY ha")}`}</p>
		      <p style={{color: payload[0].stroke}}className="label">{`Temperature: ${payload[0].value.toFixed(2)}`}&deg;{temp_unit}</p>
		      <p style={{color: payload[1].stroke}}className="label">{`Humidity: ${payload[1].value.toFixed(0)}%`}</p>
		      <p style={{color: payload[2].stroke}}className="label">{`Pressure: ${payload[2].value.toFixed(0)} `}{pressure_unit}</p>
		    </div>
		  );
		}

	    return null;
  	}
}

// CustomTooltip.propTypes = {
// 	type: PropTypes.string,
// 	payload: PropTypes.array,
// 	label: PropTypes.string,
// };

export class ReadingChart extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			data: props.data,
		};
		this.formatXAxis = this.formatXAxis.bind(this);
		this.calculatePressureDomain = this.calculatePressureDomain.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const newData = nextProps.data.slice()
		this.setState({
			data: newData,
		});
	}

	calculatePressureDomain(data) {
		const pressures = []
		data.map(reading => {
			pressures.push(reading.pressure);
		});
		let maxPressure = Math.max(...pressures);
		maxPressure += maxPressure * .02;
		let minPressure = Math.min(...pressures);
		minPressure -= minPressure * .02;
		return [minPressure, maxPressure];
	}

	formatXAxis(tickItem) {
		return moment(tickItem).format("M/D/YY ha");
	}

	render () {
		const chartMargins = {
			top: 5,
			right: 30,
			left: 20,
			bottom: 15,
		};
		let pressureDomain, pressureTicks;
		this.props.pressureMetric ? pressureDomain = [880, 1090] : pressureDomain = [26, 32];
		this.props.pressureMetric ? pressureTicks = [880, 950, 1020, 1090] : pressureTicks = [26, 28, 30, 32];
		return (
			<LineChart 
				width={600} 
				height={300} 
				data={this.state.data} 
				margin={chartMargins}
			>
				<XAxis dataKey="date_time" tickFormatter={this.formatXAxis} name={"test"}/>
				<YAxis yAxisId="left" />
				<YAxis yAxisId="right" orientation="right" domain={pressureDomain} ticks={pressureTicks}/>
				<CartesianGrid strokeDashArray="3 3" />
				<Legend verticalAlign="top" />
				<Tooltip content={<CustomTooltip tempMetric={this.props.tempMetric} pressureMetric={this.props.pressureMetric}/>} />
				<Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{r: 4}} />
				<Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#82ca9d" activeDot={{r: 4}}/>
				<Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#ccc" activeDot={{r: 4}}/>
			</LineChart>
		);
	}
}