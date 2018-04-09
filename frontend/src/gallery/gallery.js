import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

class Gallery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			photos: [],
			galleryPhotos: [],
			startDate: moment().subtract(24, "hours"),
			endDate: moment(),
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.prepPhotos = this.prepPhotos.bind(this);
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
		this.limitPhotos = this.limitPhotos.bind(this);
	}

	handleChangeStart(date) {
		const d = date;
		this.setState({
			startDate: d,
			chartReadings: this.prepPhotos(
				this.limitPhotos(this.state.photos, d.valueOf()), undefined)
		});
		console.log(d);
	}

	handleChangeEnd(date) {
		const d = date;
		this.setState({
			endDate: d,
			galleryPhotos: this.prepPhotos(
				this.limitPhotos(this.state.photos, undefined, d.valueOf()))
		});
		console.log(d);
	}

	limitPhotos(photos, startDate, endDate) {
		let sD, eD;
		if (startDate === undefined) {
			sD = moment(this.state.startDate);
		} else {
			sD = moment(startDate);
		}
		if (endDate === undefined) {
			eD = moment(this.state.endDate);
		} else {
			eD = moment(endDate);
		}

		let newPhotos = [];
		photos.forEach(photo => {
			let d = moment(photo.date_string);
			if ( d > sD && d < eD ) {
				newPhotos.push(photo);
			}
		});

		return newPhotos;
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		let photos = window.props.photos;
		this.setState({
			photos: photos,
			galleryPhotos: this.prepPhotos(this.limitPhotos(photos)),
		});
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
				thumbnail: elem.location,
			}
		});

		return newPhotos;
	}

	render() {
		return (
			<div>
				<ImageGallery items={this.state.galleryPhotos} />
				<div className="date-selection">
					<table align="center">
						<caption>Select a start and end date to limit the chart</caption>
						<thead>
							<tr>
								<th>
									Select start date
								</th>
								<th>
									Select end date
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<DatePicker
									  selected={this.state.startDate}
									  selectsStart
									  showTimeSelect
									  inline
									  startDate={this.state.startDate}
									  endDate={this.state.endDate}
									  onChange={this.handleChangeStart}
									/>
								</td>
								<td>
									<DatePicker
									  selected={this.state.endDate}
									  selectsEnd
									  showTimeSelect
									  inline
									  startDate={this.state.startDate}
									  endDate={this.state.endDate}
									  onChange={this.handleChangeEnd}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<Gallery />,
	window.react_mount,
)