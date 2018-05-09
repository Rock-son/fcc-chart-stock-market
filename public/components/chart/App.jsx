"use strict";

import React from "react";
import PropTypes from "prop-types";


import Chart from "Chart";
import Footer from "Footer";

export default class Content extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div className="chart">
				<Chart />
				<Footer />
			</div>
		);
	}
}
