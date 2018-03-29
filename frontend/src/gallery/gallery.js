import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Photos } from '../components/photos';

class Gallery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			photos: window.props.photos,
		}
	}

	render() {
		<Photos photos={window.props.photos} width={this.state.width} />
	}
}

ReactDOM.render(
	<Gallery />,
	window.react_mount,
)