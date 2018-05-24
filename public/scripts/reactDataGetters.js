"use strict";

import xss from "xss-filters";

import axios from "./api";
import chart from "./chart/index";
import { STOCK_ADD, STOCK_REMOVE } from "./events";

export function getAllStocks() {
	axios.getAllStocks()
		.then((response) => {
			if (response.data) {
				chart(response.data.map(resp => resp.chart));
				this.stocks = response.data.map(item => item.quote.code);

				this.setState({
					stocks: response.data.map(item => item.quote.code),
					stockErr: "",
					componentErr: "",
					stockDscrptn: response.data.reduce((acc, cur) => Object.assign(acc, { [cur.quote.code]: cur.quote }), {})
				});
			}
		})
		.catch(err => this.setState({ stockErr: err.message }));
}

export function removeStock(stock, noEmit = null) {
	axios.removeStock(stock)
		.then(
			(response) => {
				if (response.data) {
					chart(response.data.map(resp => resp.chart), false, stock);
					if (!noEmit) { this.socket.emit(STOCK_REMOVE, stock); }

					const stockIdx = this.state.stocks.indexOf(stock);
					if (stockIdx > -1) {
						this.stocks.splice(this.stocks.indexOf(stock), 1);
						this.input.current.click();
						this.setState(prevState => (
							{
								stocks: prevState.stocks.slice(0, stockIdx).concat(prevState.stocks.slice(stockIdx + 1)),
								stockErr: "",
								componentErr: "",
								stockDscrptn: { ...prevState.stockDscrptn, [stock]: {} }
							}));
						this.input.current.click();
					}
				}
			},
			reason => this.setState({ stockErr: reason })
		).catch((err) => { console.log(err); this.setState({ stockErr: err.message }); });
}

export function addStock(stock, noEmit = null) {
	axios.addStock(stock)
		.then(
			(response) => {
				// IF STOCK DOESN'T EXIST, SETSTATE - else do nothing
				if (typeof response.data === "object" && response.data !== "Unkown symbol") {
					chart(response.data.map(resp => resp.chart), false, null, stock);
					this.input.current.click();
					if (!noEmit) { this.socket.emit(STOCK_ADD, stock); }

					this.setState(prevState => (
						{
							stocks: [...prevState.stocks, stock],
							stockErr: "",
							componentErr: "",
							stockDscrptn: response.data.reduce((acc, cur) => Object.assign(acc, { [cur.quote.code]: cur.quote }), {})
						}
					));
				} else {
					this.setState({ stockErr: `${xss.inHTMLData(stock.toUpperCase())} stock not traded on NasDaq!` });
				}
			},
			() => this.setState({ stockErr: `${xss.inHTMLData(stock.toUpperCase())} stock not traded on NasDaq!` })
		).catch(err => this.setState({ stockErr: err }));
}
