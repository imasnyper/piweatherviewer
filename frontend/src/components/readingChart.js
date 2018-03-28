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

		if (active) {
		  const { payload, label } = this.props;
		  console.log(payload)
		  return (
		    <div className="custom-tooltip">
		      <p className="label">{`Date: ${moment(label).format("M/D/YY ha")}`}</p>
		      <p style={{color: payload[0].stroke}}className="label">{`Temperature: ${payload[0].value.toFixed(2)}`}&deg;C</p>
		      <p style={{color: payload[1].stroke}}className="label">{`Humidity: ${payload[1].value.toFixed(0)}%`}</p>
		      <p style={{color: payload[2].stroke}}className="label">{`Pressure: ${payload[2].value.toFixed(0)} mbar`}</p>
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
			data: props.data
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
		return moment(tickItem).format("M/D/YY ha");
	}

	render () {
		const chartMargins = {
			top: 5,
			right: 30,
			left: 20,
			bottom: 15,
		};
		return (
			<LineChart 
				width={600} 
				height={300} 
				data={this.state.data} 
				margin={chartMargins}
			>
				<XAxis dataKey="date_time" tickFormatter={this.formatXAxis} name={"test"}/>
				<YAxis yAxisId="left" />
				<YAxis yAxisId="right" orientation="right" domain={[900, 1200]}/>
				<CartesianGrid strokeDashArray="3 3" />
				<Legend verticalAlign="top" />
				<Tooltip content={<CustomTooltip />} />
				<Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{r: 4}} />
				<Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#82ca9d" activeDot={{r: 4}}/>
				<Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#ccc" activeDot={{r: 4}}/>
			</LineChart>
		);
	}
}