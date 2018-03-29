import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Photos } from '../components/photos';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

class Gallery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			photos: this.prepPhotos(window.props.photos),
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.prepPhotos = this.prepPhotos.bind(this);
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

	prepPhotos(photos) {
		const newPhotos = photos.map((elem, i) => {
			return {
				original: elem.location,
				thumbnail: "",
			}
		});

		return newPhotos;
	}

	render() {
		return (
			<ImageGallery items={this.state.photos} />
		);
	}
}

ReactDOM.render(
	<Gallery />,
	window.react_mount,
)