"use strict";

import React from "react";

export default function () {
	return (
		<section className="footer">
			<footer className="footer__codedby" >Coded with &nbsp;
				<span />
				<i className="fa fa-heart-o" />
				<span>&nbsp; by </span>
				<a className="footer__codedby__link" href="https://codepen.io/Roky/full/YqGqWg" target="_blank" rel="noopener noreferrer"> Roky </a>
				<span> | </span>
				<a className="footer__codedby__link" href="https://fcc-chart-the-stock-market.herokuapp.com" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
				<span> | </span>
				<a className="footer__codedby__link" href="https://iexcloud.io" target="_blank" rel="noopener noreferrer">Data provided by IEX Cloud</a>
			</footer>
		</section>
	);
}