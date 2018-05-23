"use strict";

import React from "react";
import io from "socket.io-client";
import xss from "xss-filters";

import { getAllStocks, removeStock, addStock } from "../../scripts/ChartMethods";
import { CONNECT, STOCK_ADD, STOCK_REMOVE } from "../../scripts/events";

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
		this.socket = null;
		this.stocks = []; // needed for immediate stock updating, state updates only after Promise return!
		this.input = React.createRef();
		this.searchBtn = React.createRef();

		this.addStock = this.addStock.bind(this);
		this.initSocket = this.initSocket.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.removeStock = this.removeStock.bind(this);
		this.handleEnterPress = this.handleEnterPress.bind(this);
		this.selectAllOnEnter = this.selectAllOnEnter.bind(this);
	}

	componentDidMount() {
		this.input.current.click();
		this.initSocket();
		getAllStocks.call(this);
	}

	componentDidCatch(error/* , info */) {
		// Display fallback UI
		this.setState({ componentErr: error.message });
	}

	initSocket() {
		this.socket = io();
		this.socket.on(CONNECT, console.log(`User connected!`));
		this.socket.on(STOCK_ADD, (stock) => {
			addStock.call(this, stock, "no emit");

		});
		this.socket.on(STOCK_REMOVE, (stock) => {
			removeStock.call(this, stock, "no emit");
		});
	}

	handleEnterPress(e) {
		if (e.keyCode === 13) {
			this.searchBtn.current.click();
		}
	}

	removeStock(e) {
		e.preventDefault();
		if ((e.keyCode === 13 || e.type === "click") && ((e.currentTarget || {}).getAttribute("data") || "").trim()) {
			const stock = e.currentTarget.getAttribute("data") || "";
			this.stocks.splice(this.stocks.indexOf(stock), 1);

			removeStock.call(this, stock);
		}
	}
	addStock(e) {
		e.preventDefault();
		const stock = this.state.input.trim().toUpperCase();
		if (!stock) {
			this.input.current.click();
			this.setState({ stockErr: "You need to input stock code first!" });
			return;
		}
		if (this.stocks.indexOf(stock) > -1) {
			this.input.current.click();
			this.setState({ stockErr: `${xss.inHTMLData(stock.toUpperCase())} stock already selected!` });
			return;
		}
		this.stocks.push(stock);
		addStock.call(this, stock);
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
			<div className="cards" >
				{/* <img className="cards__hero" srcSet={responseImg} alt="StocPhoto.jpeg" /> */}
				<div className="cards__container" >
					<div className="cards__container__head" >
						<h4 className="cards__container__head__header" >Syncs stocks in realtime across clients</h4>
					</div>
					<div className="cards__container__inputs" >
						<input type="text" className="cards__container__inputs__text" ref={this.input} placeholder="Stock code" value={this.state.input} onClick={this.selectAllOnEnter} onChange={this.handleInput} onKeyUp={this.handleEnterPress} />
						<input type="button" className="cards__container__inputs__button" ref={this.searchBtn} value="Add" onClick={this.addStock} />
					</div>
					<div className="cards__container__error" >{this.state.stockErr ? this.state.stockErr : ""}</div>
				</div>
				{(this.state.componentErr) ?
					(<h2 className="content__cards__error">{this.state.componentErr}</h2>) :

					(this.state.stocks.map((stock) => {
						const {
							change, close, companyName, latestTime, changePercent
						} = this.state.stockDscrptn[stock] || {};
						return (
							<div key={stock} className="cards__container" data={change < 0 ? "negative" : "positive"} >
								<div data={stock} role="button" className="cards__container__close" tabIndex={0} onClick={this.removeStock} onKeyUp={this.removeStock}>x</div>
								<div className="cards__container__head" >
									<div className="cards__container__head__header" data={change < 0 ? "negative" : "positive"} >{stock}</div>
									<div className="cards__container__head__trend" title={latestTime} data={+change < 0 ? "negative" : "positive"} >{(changePercent || 0).toFixed(2)}<span className="span"> %</span></div>
									<div className="cards__container__head__value" title={((+close - +change) || 0).toFixed(2)} data={+change < 0 ? "negative" : "positive"} >{`$${close}`}</div>
								</div>
								<div className="cards__container__description"><span>{companyName}</span>{` (${stock}) Prices and Trading Volume`}</div>
							</div>
						);
					}))
				}
			</div>
		);
	}
}
