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
		let labelText;
		if (active) {
			const { payload, label } = this.props;
			const momentObj = moment(label);
			if ( this.props.myView === "minutes" ) {
				labelText = "Date: " + momentObj.format("M/D/YY h:mma");
			} else if ( this.props.myView === "hours" ) {
				labelText = "Date: " + momentObj.format("M/D/YY ha");
			} else if ( this.props.myView === "days" ) {
				labelText = "Date: " + momentObj.format("M/D/YY");
			}
			if (payload) {
				return (
					<div className="custom-tooltip">
					<p className="label">{labelText}</p>
					<p style={{color: payload[0].stroke}}className="label">{`Temperature: ${payload[0].value.toFixed(2)}`}&deg;{temp_unit}</p>
					<p style={{color: payload[1].stroke}}className="label">{`Humidity: ${payload[1].value.toFixed(0)}%`}</p>
					<p style={{color: payload[2].stroke}}className="label">{`Pressure: ${payload[2].value.toFixed(0)} `}{pressure_unit}</p>
					</div>
				);
			}
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
	}

	componentWillReceiveProps(nextProps) {
		const newData = nextProps.data.slice()
		this.setState({
			data: newData,
		});
	}

	formatXAxis(tickItem) {
		if (this.props.view === "minutes") {
			return moment(tickItem).format("M/D/YY h:mma");	
		} else if (this.props.view === "hours") {
			return moment(tickItem).format("M/D/YY ha");
		} else if (this.props.view === "days") {
			return moment(tickItem).format("M/D/YY");
		}
		
	}

	render () {
		const chartMargins = {
			top: 5,
			right: 30,
			left: 20,
			bottom: 15,
		};
		let pressureDomain, pressureTicks, tempLabel, pressureLabel;
		this.props.pressureMetric ? pressureDomain = [880, 1090] : pressureDomain = [26, 32];
		this.props.pressureMetric ? pressureTicks = [880, 950, 1020, 1090] : pressureTicks = [26, 28, 30, 32];
		this.props.tempMetric ? 
			tempLabel = {value: "Temperature (\u00B0C)", angle: -90, position: "insideLeft"} :
			tempLabel = {value: "Temperature (\u00B0F)", angle: -90, position: "insideLeft"}
		this.props.pressureMetric ? 
			pressureLabel = {value: "Pressure (mbar)", angle: 90, position: "insideRight", offset: -5} :
			pressureLabel = {value: "Pressure (inHg)", angle: 90, position: "insideRight", offset: -5}
		return (
			<LineChart 
				width={this.props.width} 
				height={400} 
				data={this.state.data} 
				margin={chartMargins}
			>
				<XAxis 
					dataKey="date_time" 
					tickFormatter={this.formatXAxis} 
					name={"test"}
					label={{value: "Date/Time", position: "insideBottom", offset: -5}}
				/>
				<YAxis 
					yAxisId="left" 
					label={tempLabel} 
					domain={[0, 100]} 
					ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
					onClick={(e) => {this.props.clicks(1, e)}}
				/>
				<YAxis 
					yAxisId="right"
					label={pressureLabel}
					orientation="right" 
					domain={pressureDomain} 
					ticks={pressureTicks}
					onClick={(e) => {this.props.clicks(2, e)}}
				/>
				<CartesianGrid strokeDashArray="3 3" />
				<Legend verticalAlign="top" />
				<Tooltip 
					content={
						<CustomTooltip 
							myView={this.props.view} 
							tempMetric={this.props.tempMetric} 
							pressureMetric={this.props.pressureMetric}
						/>
					} 
				/>
				<Line 
					yAxisId="left" 
					type="monotone" 
					dataKey="temperature" 
					stroke="#c63521" 
					dot={false} 
					activeDot={{r: 4}} 
				/>
				<Line 
					yAxisId="left" 
					type="monotone" 
					dataKey="humidity" 
					stroke="#2e86ab" 
					dot={false} 
					activeDot={{r: 4}}
				/>
				<Line 
					yAxisId="right" 
					type="monotone" 
					dataKey="pressure" 
					stroke="#4e4859" 
					dot={false} 
					activeDot={{r: 4}}
				/>
			</LineChart>
		);
	}
}