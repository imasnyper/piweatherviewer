import React, { Component } from 'react';
import FaUser from 'react-icons/lib/fa/user'


function DesktopNav(props) {
	return (
		<div className="navbar">
			<h1>{ props.title }</h1>
			<div className="nav-items">
				<div className="login-links">
					<div className="nav-item login">
						<span>{props.message}</span>
						<a href={props.loginURL}>{props.logInOut}?</a>
					</div>
				</div>
				<span className="menu">
					<div className="nav-item home">
						<a href={props.baseURL}>Home</a>
					</div>
					<div className="nav-item">
						&nbsp;|&nbsp;
					</div>
					<div className="nav-item history">
						<a href={props.baseURL + "history/"}>History</a>
					</div>
					<div className="nav-item">
						&nbsp;|&nbsp;
					</div>
					<div className="nav-item history">
						<a href={props.baseURL + "gallery/"}>Gallery</a>
					</div>
				</span>
			</div>
		</div>
	);
}

function MobileNav(props) {
	return (
		<div className="navbar">
			<h1>{ props.title }</h1>
			<div className="nav-items">
				<div className="login-links">
					<div className="nav-item login" onClick={props.onUserClick}>
						<FaUser />
					</div>
				</div>
				<span className="menu">
					<div className="nav-item home">
						<a href={props.baseURL}>Home</a>
					</div>
					<div className="nav-item">
						&nbsp;|&nbsp;
					</div>
					<div className="nav-item history">
						<a href={props.baseURL + "history/"}>History</a>
					</div>
					<div className="nav-item">
						&nbsp;|&nbsp;
					</div>
					<div className="nav-item history">
						<a href={props.baseURL + "gallery/"}>Gallery</a>
					</div>
				</span>
			</div>
		</div>
	);
}

function MobileLogin(props) {
	return (
		<div className="mobile-login-modal">
			<div className="mobile-login">
				
			</div>
		</div>
	)
}


export default class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			baseURL: "",
			logInOut: "",
			loginURL: "",
			name: "",
			title: "",
		}
		this.onUserClick = this.onUserClick.bind(this);
	}

	onUserClick(e) {
		console.log("clicked")
	}

	componentDidMount() {
		let baseURL;
		if (this.props.debug) {
			baseURL = "http://127.0.0.1:8000/";
		} else {
			baseURL = "http://wasaweather.com/"
		}
		this.setState({
			baseURL: baseURL,
			title: this.props.title,
		});
		if (this.props.loggedIn) {
			this.setState({
				logInOut: "Sign Out",
				loginURL: baseURL + "accounts/logout/",
				name: this.props.name,
				message: "Hello " + this.props.name + ". ",
			});
		} else {
			this.setState({
				logInOut: "Sign In",
				loginURL: baseURL + "accounts/login/",
				message: "",
			});
		}
	}

	render() {
		if (props.width > 768) {
			return (
				<DesktopNav 
					title={this.state.title} 
					message={this.state.message} 
					loginURL={this.state.loginURL}
					logInOut={this.state.logInOut}
					baseURL={this.state.baseURL}>
				</DesktopNav>
			);
		} else {
			return (
				<MobileNav 
					title={this.state.title} 
					message={this.state.message} 
					loginURL={this.state.loginURL}
					logInOut={this.state.logInOut}
					baseURL={this.state.baseURL}
					onUserClick={this.onUserClick}>
				</MobileNav>
			);
		}
	}	
} 
		