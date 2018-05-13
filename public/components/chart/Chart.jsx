"use strict";

import React from "react";

import axios from "../../scripts/api";

// import chart from "./_chart";

export default class Content extends React.Component {
	static selectAllOnEnter(e) {
		e.target.select();
	}

	constructor() {
		super();

		this.state = { input: "", data: "", stocks: [], hasError: false, error: "" };
		this.input = React.createRef();
		this.searchBtn = React.createRef();

		this.handleEnterPress = this.handleEnterPress.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.selectAllOnEnter = this.selectAllOnEnter.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.removeStock = this.removeStock.bind(this);
	}

	componentDidMount() {
		this.input.current.focus();
	}
	componentDidCatch(error/* , info */) {
		// Display fallback UI
		this.setState({ hasError: true, error });
	}

	handleEnterPress(e) {
		if (e.keyCode === 13) {
			this.searchBtn.current.click();
		}
	}

	removeStock(e) {
		e.preventDefault();
		if ((e.keyCode === 13 || e.type === "click") && ((e.currentTarget || {}).id || "").trim()) {
			const stock = e.currentTarget.id;
			axios.removeStock(stock)
				.then(() => {
					const stockIdx = this.state.stocks.indexOf(stock);
					if (stockIdx > -1) {
						this.setState(prevState => ({ stocks: prevState.stocks.slice(0, stockIdx).concat(prevState.stocks.slice(stockIdx + 1)) }));
						this.input.current.click();
					}
				})
				.catch(error => this.setState({ hasError: true, error }));
		}
	}
	handleSearch(e) {
		e.preventDefault();
		axios.addStock(this.state.input)
			.then(response => console.log(response.data))
			.catch(err => console.error(err));

		if (this.state.stocks.indexOf(this.state.input) === -1 && this.state.input.trim()) {
			this.setState(prevState => ({ stocks: [...prevState.stocks, this.state.input] }));
			this.input.current.click();
		}
		this.input.current.click();
	}

	selectAllOnEnter(e) {
		e.preventDefault();
		this.constructor.selectAllOnEnter(e);
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
					<h4 className="chart__form__container__header" >Syncs stocks in realtime across clients</h4>
					<div className="chart__form__container__inputs" >
						<input type="text" className="chart__form__container__inputs__text" ref={this.input} placeholder="Stock code" value={this.state.input} onClick={this.selectAllOnEnter} onChange={this.handleInput} onKeyUp={this.handleEnterPress} />
						<input type="button" className="chart__form__container__inputs__button" ref={this.searchBtn} value="Search" onClick={this.handleSearch} />
					</div>
				</div>
				{(this.state.hasError) ?
					(<h2 className="content__cards__error">{this.state.error}</h2>) :

					(this.state.stocks.map(stock => (
						<div key={stock} className="chart__form__container">
							<div id={stock} role="button" tabIndex={0} className="chart__form__container__close" onClick={this.removeStock} onKeyUp={this.removeStock}>x</div>
							<h4 className="chart__form__container__header" >{stock}</h4>
							<div className="chart__form__container__description">Facebook Inc. (FB) Prices, Dividends, Splits and Trading Volume</div>
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

