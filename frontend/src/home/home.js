import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Reading } from '../components/readings';
import { Photos } from '../components/photos';
import moment from 'moment';

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
		const d = new Date(window.props.reading.date_string);
		return (
			<div className='react-app'>
				<Reading
					temperature={window.props.reading.temperature}
					humidity={window.props.reading.humidity}
					pressure={window.props.reading.pressure}
					date={d}>
				</Reading>
				<Photos photos={window.props.photos} width={this.state.width}/>
			</div>
		);
	}
}

ReactDOM.render(
	<Home />,
	window.react_mount,
)