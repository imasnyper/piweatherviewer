import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
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
			startDate: moment().startOf("hour").subtract(6, "hours"),
			endDate: moment().startOf("hour"),
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.prepPhotos = this.prepPhotos.bind(this);
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
		this.limitPhotos = this.limitPhotos.bind(this);
	}

	handleChangeStart(date) {
		const d = date;
		const photos = this.prepPhotos(
				this.limitPhotos(this.state.photos, d.valueOf()), undefined)
		this.setState({
			startDate: d,
			galleryPhotos: photos,
		});
		this.forceUpdate();
	}

	handleChangeEnd(date) {
		const d = date;
		const photos = this.prepPhotos(
				this.limitPhotos(this.state.photos, undefined, d.valueOf()))
		this.setState({
			endDate: d,
			galleryPhotos: photos,
		});
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
				thumbnail: elem.thumbnail !== "" ? elem.thumbnail : elem.location,
				description: moment(elem.name.substring(6, 21), "DD-MM-YY_HHmmss").tz("America/Toronto").format("MMMM Do h:mm a z"),
			}
		});

		return newPhotos;
	}

	render() {
		let galleryHidden;
		(this.state.galleryPhotos.length > 0) ? 
			galleryHidden = true : 
			galleryHidden = false ;

		console.log(this.state.galleryPhotos.length)
		console.log(galleryHidden);
		if ( this.state.width < 700 ) {
			return (
				<div>
					<div className={"gallery-wrapper " + String(galleryHidden)}>
						<ImageGallery 
							items={this.state.galleryPhotos}
						/>
					</div>
					<div className={"message " + String(!galleryHidden)}>
						No photos for the selected date range. Try extending the range.
					</div>
					<div className={"date-selection-mobile"}>
						<h4>Select a start and end date to limit the chart</h4>
						Select start date
						<DatePicker
						  selected={this.state.startDate}
						  selectsStart
						  showTimeSelect
						  startDate={this.state.startDate}
						  endDate={this.state.endDate}
						  onChange={this.handleChangeStart}
						/>
						Select end date
						<DatePicker
						  selected={this.state.endDate}
						  selectsEnd
						  showTimeSelect
						  startDate={this.state.startDate}
						  endDate={this.state.endDate}
						  onChange={this.handleChangeEnd}
						/>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div className={"gallery-wrapper " + String(galleryHidden)}>
						<ImageGallery 
							items={this.state.galleryPhotos}
						/>
					</div>
					<div className={"message " + String(!galleryHidden)}>
						No photos for the selected date range. Try extending the range.
					</div>
					<div className={"date-selection"}>
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
}

ReactDOM.render(
	<Gallery />,
	window.react_mount,
)