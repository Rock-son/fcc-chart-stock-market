"use strict";

import React from "react";


import Chart from "Chart";
import Footer from "Footer";
import css from "../../style/chart/index";

export default () => {
	return (
		<div className="chart">
			<Chart />
			<Footer />
			<div className="chart-container" />
		</div>
	);
};
