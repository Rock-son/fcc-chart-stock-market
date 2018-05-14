"use strict";

import React from "react";
import xss from "xss-filters";

import axios from "../../scripts/api";

// import chart from "./_chart";

export default class Content extends React.Component {
	static selectAllOnEnter(e) {
		e.target.select();
	}

	constructor() {
		super();

		this.state = {
			input: "", stocks: [], stockData: {}, stockDscrptn: {}, componentErr: "", duration: "1m", stockErr: ""
		};
		this.input = React.createRef();
		this.searchBtn = React.createRef();

		this.handleEnterPress = this.handleEnterPress.bind(this);
		this.addStock = this.addStock.bind(this);
		this.selectAllOnEnter = this.selectAllOnEnter.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.removeStock = this.removeStock.bind(this);
	}

	componentDidMount() {
		this.input.current.focus();
	}
	componentDidCatch(error/* , info */) {
		// Display fallback UI
		this.setState({ componentErr: error });
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
				.then(
					() => {
						const stockIdx = this.state.stocks.indexOf(stock);
						if (stockIdx > -1) {
							this.setState(prevState => (
								{
									stocks: prevState.stocks.slice(0, stockIdx).concat(prevState.stocks.slice(stockIdx + 1)),
									stockErr: "",
									componentErr: "",
									stockData: { ...prevState.stockData, [stock]: [] },
									stockDscrptn: { ...prevState.stockDscrptn, [stock]: {} }
								}));
							this.input.current.click();
						}
					},
					reason => this.setState({ stockErr: reason })
				).catch(err => this.setState({ stockErr: err }));
		}
	}
	addStock(e) {
		e.preventDefault();
		const stock = this.state.input.trim();
		const duration = this.state.duration.trim();
		if (!stock || !duration) { return; }

		axios.addStock(stock, duration)
			.then(
				(response) => {
					// IF STOCK DOESN'T EXIST, SETSTATE - else do nothing
					if (this.state.stocks.indexOf(stock) === -1 && stock && typeof response.data === "object") {
						this.setState(prevState => (
							{
								stocks: [...prevState.stocks, stock],
								stockErr: "",
								componentErr: "",
								stockData: { ...prevState.stockData, [stock]: response.data.chartData.chart },
								stockDscrptn: { ...prevState.stockDscrptn, [stock]: response.data.chartData.quote }
							}
						));
					} else {
						this.setState({ stockErr: `${xss.inHTMLData(stock.toUpperCase())} stock not traded on NasDaq!` });
					}
				},
				() => this.setState({ stockErr: `${xss.inHTMLData(stock.toUpperCase())} stock not traded on NasDaq!` })
			).catch(err => this.setState({ stockErr: err }));


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
					<div className="chart__form__container__head" >
						<h4 className="chart__form__container__head__header" >Syncs stocks in realtime across clients</h4>
					</div>
					<div className="chart__form__container__inputs" >
						<input type="text" className="chart__form__container__inputs__text" ref={this.input} placeholder="Stock code" value={this.state.input} onClick={this.selectAllOnEnter} onChange={this.handleInput} onKeyUp={this.handleEnterPress} />
						<input type="button" className="chart__form__container__inputs__button" ref={this.searchBtn} value="Search" onClick={this.addStock} />
					</div>
					<div className="chart__form__container__error" >{this.state.stockErr ? this.state.stockErr : ""}</div>
				</div>
				{(this.state.componentErr) ?
					(<h2 className="content__cards__error">{this.state.componentErr}</h2>) :

					(this.state.stocks.map((stock) => {
						const { change, close, companyName, latestTime, previousClose } = this.state.stockDscrptn[stock] || {};
						return (
							<div key={stock} className="chart__form__container">
								<div id={stock} role="button" className="chart__form__container__close" tabIndex={0} onClick={this.removeStock} onKeyUp={this.removeStock}>x</div>
								<div className="chart__form__container__head" >
									<h4 className="chart__form__container__head__header" >{stock}</h4>
									<div className="chart__form__container__head__trend" title={latestTime} data={change < 0 ? "negative" : "positive"} >{change}</div>
									<div className="chart__form__container__head__value" title={previousClose} data={change < 0 ? "negative" : "positive"} >{`$${close}`}</div>
								</div>
								<div className="chart__form__container__description"><span style={{ fontWeight: 700 }}>{companyName}</span>{` (${stock}) Prices and Trading Volume`}</div>
							</div>
						);
					}))
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

