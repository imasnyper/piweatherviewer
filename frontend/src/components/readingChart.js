import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';

const data = [
	{date_time: 24, temp: 67, humidity: 89, pressure: 1018},
	{date_time: 25, temp: 75, humidity: 70, pressure: 1000},
	{date_time: 26, temp: 80, humidity: 60, pressure: 900},
	{date_time: 27, temp: 69, humidity: 76, pressure: 980},
	{date_time: 28, temp: 90, humidity: 99, pressure: 1100},
]

export class ReadingChart extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			data: props.data
		};
		this.formatXAxis = this.formatXAxis.bind(this);
	}

	formatXAxis(tickItem) {
		return moment(tickItem).format("M/D/YY h a");
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
				<XAxis dataKey="date_time" tickFormatter={this.formatXAxis}/>
				<YAxis yAxisId="left" />
				<YAxis yAxisId="right" orientation="right" domain={[900, 1200]}/>
				<CartesianGrid strokeDashArray="3 3" />
				<Tooltip />
				<Legend />
				<Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{r: 4}} />
				<Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#82ca9d" activeDot={{r: 4}}/>
				<Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#ccc" activeDot={{r: 4}}/>
			</LineChart>
		);
	}
}