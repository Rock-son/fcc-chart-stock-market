"use strict";

import React from "react";
import PropTypes from "prop-types";

const defaultObj = {};
const defaultArray = [];

export default class Content extends React.Component {
	static handleClick(e) {
		e.target.select();
	}

	constructor(props) {
		super(props);

		this.handleEnterPress = this.handleEnterPress.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	componentDidMount() {

	}

	handleEnterPress(e) {
		if (e.keyCode === 13) {
			this.searchBtn.current.click();
		}
	}

	handleSearch(e) {
		e.preventDefault();
	}

	handleClick(e) {
		e.preventDefault();
		this.constructor.handleClick(e);
	}

	handleInput(e) {
		e.preventDefault();
	}

	render() {
		const responseImg = "./assets/images/pexels-photo-260920.jpeg 640w, ./assets/images/pexels-photo-260921.jpeg 1280w, ./assets/images/pexels-photo-260922.jpeg 1920w";

		return (<div>Hello</div>);
	}
}

Content.propTypes = {
	// STATES

	// ACTIONS

	// ERRORS
};

