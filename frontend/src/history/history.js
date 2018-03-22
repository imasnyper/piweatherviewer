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
			metricUnits: true
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState({
			metricUnits: !this.state.metricUnits,
		})
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
				<button type="button" onClick={this.handleClick}>Toggle</button>
				<Readings 
					readings={window.props.readings} 
					units={this.state.metricUnits}
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