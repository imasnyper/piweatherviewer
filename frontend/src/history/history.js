import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Readings } from '../components/readings';
import { Photos } from '../components/photos';

class History extends Component {
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

	render() {
		console.log(this.state.units);
		return (
			<div className='react-app'>
				<button type="button" onClick={(e) => {this.handleClick(3, e)}}>Toggle</button>
				<Readings 
					readings={window.props.readings} 
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