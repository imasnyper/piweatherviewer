import React from 'react';


export function Navbar(props) {
	let baseURL;
	if (props.debug) {
		baseURL = "http://127.0.0.1:8000/"
	} else {
		baseURL = "http://wasaweather.com/"
	}

	return (
		<div class="navbar">
			<h1>{ props.title }</h1>
			<div class="nav-items">
				<div class="nav-item home">
					<a href={baseURL}>Home</a>
				</div>
				<div class="nav-item">
					&nbsp;|&nbsp;
				</div>
				<div class="nav-item history">
					<a href={baseURL + "history/"}>History</a>
				</div>
				<div class="nav-item">
					&nbsp;|&nbsp;
				</div>
				<div class="nav-item history">
					<a href={baseURL + "gallery/"}>Gallery</a>
				</div>
			</div>
		</div>
	);
} 
		