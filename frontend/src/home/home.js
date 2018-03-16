import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Readings } from '../components/readings';
import { Photos } from '../components/photos';

class Home extends Component {
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
				<Photos photos={window.props.photos} />
			</div>
		);
	}
}

ReactDOM.render(
	<Home />,
	window.react_mount,
)