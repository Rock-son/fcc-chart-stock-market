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
			input: "", stocks: [], stockDscrptn: {}, componentErr: "", stockErr: ""
		};
		this.stockData = null;
		this.input = React.createRef();
		this.searchBtn = React.createRef();

		this.addStock = this.addStock.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.removeStock = this.removeStock.bind(this);
		this.handleEnterPress = this.handleEnterPress.bind(this);
		this.selectAllOnEnter = this.selectAllOnEnter.bind(this);
	}

	componentDidMount() {
		this.input.current.focus();

		axios.getAllStocks()
			.then((response) => {
				if (!response.data.length) { return ""; }
				// GET FROM  [{quote:{symbol:"tsla"}, chart: []}] TO:  [[{id: "tsla", values: [{date: chart.date, value: chart.close}, ...]}], [{...}], ...]
				const chart = response.data.map(resp => ({
					id: (resp.quote || { symbol: "no data" }).symbol,
					values: resp.chart.map(values => ({
						date: values.date,
						price: values.close
					}))
				}));
				this.stockData = chart.slice(0);
				this.setState({
					stocks: response.data.map(item => item.quote.symbol),
					stockErr: "",
					componentErr: "",
					stockDscrptn: response.data.reduce((acc, cur) => Object.assign(acc, { [cur.quote.symbol]: cur.quote }), {})
				});
			})
			.catch(err => err);
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
		const stock = this.state.input.trim().toUpperCase();
		if (!stock) {
			this.setState({ stockErr: "You need to input stock code first!" });
			return;
		}
		if (this.state.stocks.indexOf(stock) > -1) {
			this.setState({ stockErr: `${xss.inHTMLData(stock.toUpperCase())} stock already selected!` });
			return;
		}

		axios.addStock(stock)
			.then(
				(response) => {
					// IF STOCK DOESN'T EXIST, SETSTATE - else do nothing
					if (stock && typeof response.data === "object") {
						this.setState(prevState => (
							{
								stocks: [...prevState.stocks, stock],
								stockErr: "",
								componentErr: "",
								stockDscrptn: { ...prevState.stockDscrptn, [stock]: response.data.chartData.quote }
							}
						));
					} else {
						this.setState({ stockErr: `${xss.inHTMLData(stock.toUpperCase())} stock not traded on NasDaq!` });
					}
				},
				() => this.setState({ stockErr: `${xss.inHTMLData(stock.toUpperCase())} stock not traded on NasDaq!` })
			).catch(err => this.setState({ stockErr: err }));
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
						<input type="button" className="chart__form__container__inputs__button" ref={this.searchBtn} value="Add" onClick={this.addStock} />
					</div>
					<div className="chart__form__container__error" >{this.state.stockErr ? this.state.stockErr : ""}</div>
				</div>
				{(this.state.componentErr) ?
					(<h2 className="content__cards__error">{this.state.componentErr}</h2>) :

					(this.state.stocks.map((stock) => {
						const {
							change, close, companyName, latestTime, previousClose
						} = this.state.stockDscrptn[stock] || {};
						return (
							<div key={stock} className="chart__form__container">
								<div id={stock} role="button" className="chart__form__container__close" tabIndex={0} onClick={this.removeStock} onKeyUp={this.removeStock}>x</div>
								<div className="chart__form__container__head" >
									<div className="chart__form__container__head__header" data={change < 0 ? "negative" : "positive"} >{stock}</div>
									<div className="chart__form__container__head__trend" title={latestTime} data={change < 0 ? "negative" : "positive"} >{change}</div>
									<div className="chart__form__container__head__value" title={previousClose} data={change < 0 ? "negative" : "positive"} >{`$${close}`}</div>
								</div>
								<div className="chart__form__container__description"><span>{companyName}</span>{` (${stock}) Prices and Trading Volume`}</div>
							</div>
						);
					}))
				}
			</div>
		);
	}
}
