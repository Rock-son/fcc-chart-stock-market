"use strict";

import React from "react";

import request from "../apis/api";

// import chart from "./_chart";

export default class Content extends React.Component {
	static handleClick(e) {
		e.target.select();
	}

	constructor() {
		super();

		this.state = { input: "", data: "", stocks: [], hasError: false, error: "" };
		this.handleEnterPress = this.handleEnterPress.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	componentDidMount() {

	}
	componentDidCatch(error, info) {
		// Display fallback UI
		console.log(error, info);
		this.setState({ hasError: true, error });
	}

	handleEnterPress(e) {
		if (e.keyCode === 13) {
			this.searchBtn.current.click();
		}
	}

	handleSearch(e) {
		e.preventDefault();
		/* request.addStock(this.state.input)
			.then()
			.catch(); */
		if (this.state.stocks.indexOf(this.state.input) === -1) {
			this.setState(prevState => ({ stocks: [...prevState.stocks, this.state.input] }));
		}
	}

	handleClick(e) {
		e.preventDefault();
		this.constructor.handleClick(e);
	}

	handleInput(e) {
		e.preventDefault();
		this.setState({ input: e.target.value.toUpperCase() });
	}

	render() {
		// const responseImg = "./assets/images/pexels-photo-260920.jpeg 640w, ./assets/images/pexels-photo-260921.jpeg 1280w, ./assets/images/pexels-photo-260922.jpeg 1920w";

		return (
			<div className="chart__form" >
				<div className="chart__form__container" >
					<h2 className="chart__form__container__header" >Syncs stocks in realtime across clients</h2>
					<div className="chart__form__container__inputs" >
						<input type="text" className="chart__form__container__inputs__text" placeholder="Stock code" value={this.state.input} onClick={this.handleClick} onChange={this.handleInput} />
						<input type="button" className="chart__form__container__inputs__button" value="Search" onClick={this.handleSearch} />
					</div>
				</div>
				{(this.state.hasError) ?
					(<h2 className="content__cards__error">{`There was an error (${this.state.error}), please try again later!`}</h2>) :

					(this.state.stocks.map(stock => (
						<div key={stock} className="chart__form__container__stocks">{stock}
							<div className="chart__form__container__stocks_description">Facebook Inc. (FB) Prices, Dividends, Splits and Trading Volume</div>
						</div>))
					)
				}
			</div>
		);
	}
}

Content.propTypes = {
	// STATES

	// ACTIONS

	// ERRORS
};

