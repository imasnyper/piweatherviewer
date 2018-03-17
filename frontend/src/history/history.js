import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Readings } from '../components/readings';
import { Photos } from '../components/photos';

class History extends Component {
	constructor(props) {
		super(props);
		this.state = { width: 0, height: 0 }
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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
		return (
			<div className='react-app'>
				<Readings readings={window.props.readings} />
				<Photos photos={window.props.photos} width={this.state.width} />
			</div>
		);
	}
}

ReactDOM.render(
	<History />,
	window.react_mount,
)