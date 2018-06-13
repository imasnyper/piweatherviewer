import React from 'react';


export function Navbar(props) {
	let baseURL;
	if (props.debug) {
		baseURL = "http://127.0.0.1:8000/"
	} else {
		baseURL = "http://wasaweather.com/"
	}

	return (
		<div className="navbar">
			<h1>{ props.title }</h1>
			<div className="nav-items">
				<div className="nav-item home">
					<a href={baseURL}>Home</a>
				</div>
				<div className="nav-item">
					&nbsp;|&nbsp;
				</div>
				<div className="nav-item history">
					<a href={baseURL + "history/"}>History</a>
				</div>
				<div className="nav-item">
					&nbsp;|&nbsp;
				</div>
				<div className="nav-item history">
					<a href={baseURL + "gallery/"}>Gallery</a>
				</div>
			</div>
		</div>
	);
} 
		