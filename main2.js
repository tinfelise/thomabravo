import { PE, stock } from './src/finance.js';
import { UI } from './src/ui.js';
import { constants } from './src/constants.js';
import { PolygonAPI, AlphaVantageAPI } from './src/api.js';
const finance = new Finance();

// let stock_data = {};
let time_series_data = {};
let time_series_dates = {};
let current_price, previous_closing_price;

// let investment, realized, unrealized;
// let all_realizations = [];

let AppState = [];

let refresh_interval;

// var current_shares;

const alphavantage_key = 'B67FR48WBLNMCCHH';
const polygon_key = 'A96sRRl_tmn0UPaiPC2Q2JRep2P62UJ4';
const polygon_path = 'https://api.polygon.io';

function get_market_status (ticker) {
	$('#ticker').html(ticker);
	var path = polygon_path + '/v1/marketstatus/now' + '?apikey=' + polygon_key;
	var settings = {
		url: path,
		beforeSend: function () {
			console.log('Checking market status...')
			console.log(path);
		},
		error: function () {
			get_polygon_stock_snapshot(ticker);
		},
		success: function (data) {
			var status = data.market;
			console.log('Markets are ' + status + '.');
			choose_price(status);
		},
		timeout: 3000
	};
	$.ajax(settings)
};
function choose_price (market_status) {
	if (market_status == 'open') {
		get_last_trade(data.ticker);
	} else {
		get_polygon_stock_snapshot(data.ticker, market_status);
	};
};

function get_polygon_stock_snapshot (ticker, market_status) { // accepts comma separated tickers
	var path = polygon_path + '/v2/snapshot/locale/us/markets/stocks/tickers/' + ticker + '?apikey=' + polygon_key;
	var settings = {
		url: path,
		beforeSend: function () {
			console.log('Fetching snapshot...')
			console.log(path);
		},
		error: function () {
			no_data();
		},
		success: function (data) {
			parse_polygon_snapshot(data, ticker, market_status);
		}
	};
	$.ajax(settings)
};
function parse_polygon_snapshot (snapshot, ticker, market_status) {
	console.log(snapshot);
	current_price = snapshot.ticker.day.c;
	previous_closing_price = snapshot.ticker.prevDay.c;
	let last_updated = snapshot.ticker.updated;
		last_updated = Math.round(last_updated / constants.million);
	$('#ticker').html(ticker);
	UI.display_updated_time(last_updated, 'x', market_status);
	do_the_math (current_price, previous_closing_price);
};

function get_last_trade (ticker) {
	const path = polygon_path + '/v2/last/trade/' + ticker +
	'?apikey=' + polygon_key;
	const settings = {
		url: path,
		beforeSend: function () {
			console.log('Fetching last trade from...')
			console.log(path);
		},
		error: function () {
			no_data();
		},
		success: function (data) {
			console.log('Last traded at $' + data.results.p + '.');
			get_closing_price(ticker, data.results.p);
		}
	};
	$.ajax(settings)
};
function get_closing_price(ticker, last_trade) {
	var path = polygon_path + '/v2/aggs/ticker/' + ticker +
	'/prev' + '?apikey=' + polygon_key;
	var settings = {
		url: path,
		beforeSend: function () {
			console.log('Fetching previous closing price...')
			console.log(path);
		},
		error: function () {
			no_data();
		},
		success: function (data) {
			console.log('Previously closed at $' + data.results[0].c + ' on ' + moment(data.results[0].t, 'x').format('LLL') + '.');
			parse_real_time_data(data.results[0], last_trade);
		}
	};
	$.ajax(settings)
};
function parse_real_time_data (closing_data, last_trade) {
	current_price = last_trade;
	previous_closing_price = closing_data.c;
	// display_updated_time(closing_data.t, 'x', 'open'); //not working because previous day of week is not correct
	UI.display_previous_day_of_week(closing_data.t, 'x');
	do_the_math (current_price, previous_closing_price);
};
function no_data () {
	console.log('Polygon did not return data.');
	$('main').addClass('loaded');
	$('#stockData .data').html('<h1>Data Unavailable</h1><span>Please try again later.</span>');
};

// function display_update_time (date, time, open) {
// 	var html = 'As Of ';
// 	if (open) {
// 		var date_time = date + ' ' + time;
// 		html += moment(date_time, 'YYYY-MM-DD LTS').format('h:mmA');
// 	} else {
// 		var exchange_open = moment('9:30 AM -05:00', 'LT Z');
// 		var exchange_close = moment('4:00 PM -05:00', 'LT Z');
// 		if ( moment().isBetween(exchange_open, exchange_close) == false ) {
// 			html += 'closing ';
// 		}
// 		html += moment(date, 'YYYY-MM-DD').format('MMM. Do');
// 	};
// 	$('#updated').html(html);
// };

function percentage_change (current, previous) {
	const diff = current - previous;
	const percentage_change = diff/previous;
	return numeral(percentage_change).format('0.0%');
};

// function get_IRR (realizations) {
// 	var amounts = [];
// 	var dates = [];
// 	for (i in realizations) {
// 		amounts[i] = realizations[i].amount * constants.million;
// 		dates[i] = constants.return_date('MM/DD/YY',realizations[i].date);
// 	};
// 	var XIRR = finance.XIRR(amounts, dates) / 100;
// 	$('.IRR').html( numeral(XIRR).format('0,0[.]0%') + ' <span>IRR</span>' );
// };
// function order_events (events, format) {
// 	events = events.sort(function (a, b) {
//     	return moment(a.date, format).format('x')
//     		.localeCompare(
//     			moment(b.date, format).format('x')
// 			);
// 	});
// };
// function calc_MoM (gains) {
// 	return gains / investment;
// };

// function total_gains_MoM (realizations) {
// 	sum_transactions(transactions);
	
// 	const total_returns = realized + unrealized;
// 	const total_MoM = calc_MoM(total_returns);
// 	const total_gain = total_returns - investment;

// 	$('.realized').html('<h2>' + numeral(realized).format('$0,0.0a') + '</h2>');
// 	$('.realized').append('<div class="MoM"><span>' + numeral( calc_MoM(realized) ).format('0[.]00') + 'x</span> MoM</div>');

// 	$('.unrealized').html('<h2>' + numeral(unrealized).format('$0,0.0a') + '</h2>');
// 	$('.unrealized').append('<div class="MoM"><span>' + numeral( calc_MoM(unrealized) ).format('0[.]00') + 'x</span> MoM</div>');

// 	$('.total_returns').html('<h2>' + numeral(total_returns).format('$0,0.0a') + '</h2>');
// 	$('.total_returns').append('<div class="MoM"><span>' + numeral( calc_MoM(total_returns) ).format('0[.]00') + 'x</span> MoM</div>');

// 	$('.total_gain label').html( numeral(total_gain).format('$0,0.0a') );
// };
// function sum_transactions (all_transactions) {
// 	realized = 0;
// 	investment = 0;
// 	current_shares = 0;
// 	for (i in all_transactions) {
// 		var value = all_transactions[i].amount
// 		if (value > 0) {
// 			realized += value * constants.million;
// 		} else {
// 			investment += -value * constants.million;
// 		};

// 		var shares = all_transactions[i].shares;
// 		if (shares) {
// 			current_shares += shares * constants.million;
// 		};
// 	};
// 	get_TB_shares_value(current_shares);
// };
// function get_TB_shares_value (shares) {
// 	const TB_shares_value = shares * current_price;
// 	$('.TB_shares_value').html( numeral(TB_shares_value).format('$0.0a') + ' <span>Value</span>' );
// 	calc_unrealized(TB_shares_value);
// };
// function calc_unrealized(share_value) {
// 	unrealized = share_value;
// 	var IPO_mark = {
// 		'event': 'IPO Mark',
// 		'date': moment().format('MM/DD/YY'),
// 		'amount': (share_value / constants.million)
// 	};
// 	add_new_realizations(transactions);
// 	add_new_realizations([IPO_mark]);
// 	order_events(all_realizations, 'MM/DD/YY');
// 	get_IRR(all_realizations);
// };
// function add_new_realizations (array) {
// 	for (obj in array) {
// 		all_realizations.push(array[obj]);
// 	};
// 	order_events(all_realizations, 'MM/DD/YY');
// };

// Valuation Metrics & Revenue Multiples
function get_market_cap (price, fdso) {
	const market_cap = fdso * price * constants.million;
	return market_cap;
};
function get_enterprise_value (market_cap, net_debt) {
	const enterprise_value = market_cap + (net_debt * constants.million);
	return enterprise_value;
};
function display_valuation_metrics (price, fdso, net_debt, multiples) {
	const market_cap_value = get_market_cap(price, fdso);
	const enterprise_value = get_enterprise_value(market_cap_value, net_debt);
	const revenue_multiples = stock.calculate_revenue_multiples(enterprise_value, multiples);
	$('#market_cap').html(numeral(market_cap_value).format('($0.00a)') + ' <span>Market Cap</span>');
	$('#enterprise_value').html(numeral(enterprise_value).format('($0.00a)') + ' <span>Enterprise Value</span>');
	$('#revenues_multiples').html(display_revenue_multiples(revenue_multiples));
};
// function calculate_revenue_multiples (enterprise_value, all_multiples) {
// 	const multiples = [];
// 	for (let multiple in all_multiples) {
// 		for (let year in all_multiples[multiple].years) {
// 			const amount = all_multiples[multiple].years[year];
// 			const multiple_value = enterprise_value / (amount * constants.million);
// 			const type = all_multiples[multiple].type;
// 			const name = `${year} ${type}`;
// 			multiples.push({
// 				multiple: multiple_value,
// 				name: name
// 			});
// 		};
// 	};
// 	return multiples;
// };
function display_revenue_multiples (multiples) {
	let html = '';
	for (let i in multiples) {
		const multiple = multiples[i];
		html += create_revenue_multiple (multiple.multiple, multiple.name);
	};
	return html;
};
function create_revenue_multiple (multiple_value, name) {
	const multiple_html = `<h3 class="multiple">${numeral(multiple_value).format('0.00')}x <span>${name}</span></h3>`;
	return multiple_html;
};

// function dilute_shares(options) {
// 	var RSUs_Options = 0;
// 	for (issuance in options) {
// 		var strike_price = options[issuance].strike;
// 		var shares = options[issuance].shares;
// 		var diluted = 0;
// 		if (current_price > strike_price) {
// 			diluted = (current_price - strike_price)/current_price*shares;
// 		};
// 		RSUs_Options += diluted;
// 	};
// 	get_market_cap(RSUs_Options);
// };

async function do_the_math (current_price, price_yesterday) {
	const compared_to_yesterday = current_price - price_yesterday;
	const compared_to_yesterday_perc = percentage_change(current_price,price_yesterday);
	UI.display_current_price(current_price, compared_to_yesterday, compared_to_yesterday_perc);
	check_IPO_price(current_price); 
	display_valuation_metrics(current_price, data.FDSO, data.net_debt, data.multiples);
	// below should be broken out by ownership group
	const money_types = get_money_types(data.transactions);
	const ownership_metrics = PE.get_ownership_metrics(current_price, data);
	AppState.push(ownership_metrics);
	UI.add_thoma_section(ownership_metrics.group, ownership_metrics);
	if (money_types.length > 1) {
		for (let type in money_types) {
			const group = money_types[type];
			const subgroup_metrics = PE.get_ownership_metrics(current_price, data, group);
			AppState.push(subgroup_metrics);
			UI.add_thoma_section(subgroup_metrics.group, subgroup_metrics);
		};
		UI.add_group_nav(money_types);
	};
	await check_for_comps();
	check_for_disclaimer();
};

function get_money_types(transactions) {
    return [...new Set(transactions.map(t => t.group))];
};

// IPO Price Comparison
function check_IPO_price (current_stock_price) {
	if ( typeof data.IPO !== 'undefined') {
		get_IPO_price(data.IPO, current_stock_price);
	};
};
function get_IPO_price (IPO, current_stock_price) {
	const IPO_change = (current_stock_price / IPO.price) - 1;
	const amounts = [-IPO.price, +current_price];
	const dates = [constants.return_date('M/D/YY',IPO.date),constants.return_date()];
	const XIRR = finance.XIRR(amounts, dates) / 100;
	UI.display_IPO_price(IPO.price, IPO_change, XIRR);
};

// function get_target_price (target_MoM, label, output) {
// 	var target_price = calc_target_price(target_MoM);
// 	label.value = target_MoM;
// 	output.value = numeral(target_price).format('$0.00');
// };

// Comps
async function check_for_comps () {
	if (typeof data.comps !== 'undefined') {
		const comparable_companies = await get_comps(data.comps);
		UI.create_comps_section(comparable_companies);
		console.log('Comparable Companies:', comparable_companies);
	}
};
async function get_comps (comps) {
	const comparable_companies = [];
	try {
		const snapshotPromises = comps.map(comp => {
			console.log('Getting snapshot for:', comp.ticker);
			return PolygonAPI.getSnapshot(comp.ticker).then(data => ({
				snapshot: data,
				comp: comp
			}));
		});
		const comp_data = await Promise.all(snapshotPromises);
		comparable_companies.push(...parse_comp_data(comp_data));
		return comparable_companies;
	} catch (error) {
		console.error('Error fetching comp data:', error);
	}
};
function parse_comp_data (comp_data) {
	return comp_data.map(({ snapshot, comp }) => {
		const parsed_data = {};
		parsed_data.name = comp.name;
		parsed_data.ticker = comp.ticker;
		parsed_data.logo = comp.logo;
		parsed_data.multiples = comp.multiples;
		parsed_data.current_price = snapshot.ticker.day.c;
		parsed_data.previous_closing_price = snapshot.ticker.prevDay.c;
		parsed_data.last_updated = snapshot.ticker.updated;
		parsed_data.daily_change = snapshot.ticker.todaysChange;
		parsed_data.daily_change_perc = snapshot.ticker.todaysChangePerc / 100;
		parsed_data.market_cap = get_market_cap(parsed_data.current_price, comp.FDSO);
		parsed_data.enterprise_value = get_enterprise_value(parsed_data.market_cap, comp.net_debt);
		return parsed_data;
	});
}

// Disclaimer
function check_for_disclaimer () {
	if ( typeof data.disclaimer != 'undefined') {
		UI.add_disclaimer (data.disclaimer);
	};
};

// Chart
function get_chart_date_range () {
	var start_date = moment(data.IPO.date, 'MM/DD/YY').format('YYYY-MM-DD');
	var end_date = moment().format('YYYY-MM-DD');
	get_polygon_aggregates(data.ticker, start_date, end_date);
};
function get_polygon_aggregates (ticker, start_date, end_date) {
	var path = polygon_path + '/v2/aggs/ticker/' + ticker +
	'/range/1/day/' + start_date + '/' + end_date + '?apikey=' + polygon_key;
	var settings = {
		url: path,
		beforeSend: function () {
			console.log('Fetching historical stock data from...')
			console.log(path);
		},
		error: function () {
			console.log('Error fetching historical stock data.');
		},
		success: function (data) {
			parse_polygon_aggregates(ticker, data);
		}
	};
	$.ajax(settings)
};
function parse_polygon_aggregates (ticker, data) {
	console.log(data);
};

function get_time_series_data (ticker) {
	var path = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + ticker +
	'&outputsize=compact&apikey=' + alphavantage_key;
	var settings = {
		url: path,
		beforeSend: function () {
			console.log('Fetching historical stock data from...')
			console.log(path);
		},
		error: function () {},
		success: function (data) {
			parse_time_series_data(ticker, data);
		}
	};
	$.ajax(settings)
};
function parse_time_series_data (ticker, data) {
	if (data['Time Series (Daily)'] != undefined) {
		time_series_data = data['Time Series (Daily)'];
		time_series_dates = Object.keys(time_series_data);
		console.log(time_series_data);
		UI.create_chart(time_series_data,time_series_dates);
	} else {
		console.log(data);
	};
};
function get_closing_prices (data, index) {
	var closing_prices = [];
	for (let i in index) {
		const point = data[index[i]];
		const closing_price = point['4. close'];
		closing_prices.push(closing_price);
	};
	return closing_prices;
};

// News
function get_polygon_news (ticker, count) {
	var path = polygon_path + '/v2/reference/news?ticker=' + ticker;
		path += '&limit=' + count + '&sort=published_utc&order=desc' + '&apikey=' + polygon_key;
	var settings = {
		url: path,
		beforeSend: function () {
			console.log('Fetching news & sentiments...');
			console.log(path);
		},
		error: function () {
			console.log('No news or sentiments.');
		},
		success: function (data) {
			console.log(data);
			parse_polygon_news(data, ticker);
		}
	};
	$.ajax(settings)
};
function parse_polygon_news (news, ticker) {
	if (news.results.length > 0) {
		var html = '<h2>News</h2>';
		$('#news').append(html);
		
		const IPODateUTC = moment(data.IPO.date, 'MM/DD/YY').utc().toISOString();
		for (let i in news.results) {
			const article = news.results[i];
			if (article.published_utc >= IPODateUTC) {
				UI.create_article(article, ticker);
			};
		};
	};
};

// Tests
async function dummy_data (tick, current, last, message) {
	current_price = current;
	previous_closing_price = last;
	var today = moment().format('YYYY-MM-DD');
	var time = moment().format('h:mmA');
	var open = true;
	var previous = previous_market_day(today, 'YYYY-MM-DD');

	$('#ticker').html(tick);
	$('header button').hide();
	// display_update_time(today, time, open);
	UI.display_previous_day_of_week(moment(previous, 'YYYY-MM-DD'));
	await do_the_math(current_price, previous_closing_price);
	if (message) {
		$('html').append('<div class="disclaimer">' + decodeURIComponent(message) + '</div>');
	};
};
function check_for_tests (obj) {
	var test = obj.test;
	if (test) {
		console.log('Test:' + test)
		var input = test.split('(')[1];
		if (input) {
			input = input.split(')')[0];
			input = input.split(',');
			console.log('with input(s): ' + input);
		};
		test = test.split('(')[0];
		window[test].apply(null,input);
	};
	if (test != 'dummy_data') {
		UI.add_loader();
		get_market_status(data.ticker);
		get_time_series_data(data.ticker);
		get_polygon_news(data.ticker, 100);
	};
};
function parseURLs() {
	let currentURL = window.location.href;
		currentURL = currentURL.split('?')[1];
	if (currentURL) {
		currentURL = currentURL.split('&');
	};
	const parameters = {};
	for (let i in currentURL) {
		const key = currentURL[i].split('=')[0];
		const val = currentURL[i].split('=')[1];
		parameters[key] = val;
	};
	check_for_tests(parameters);
};

// UI Events
function auto_refresh(seconds) {
	var time = seconds * 1000;
	refresh_interval = setInterval(UI.reload, time); 
};
function stop_refreshing() {
	clearInterval(refresh_interval);
};
  
function bindUIEvents() {
	document.addEventListener('webkitfullscreenchange', UI.exitFullscreen, false);
	document.addEventListener('mozfullscreenchange', UI.exitFullscreen, false);
	document.addEventListener('fullscreenchange', UI.exitFullscreen, false);
	document.addEventListener('MSFullscreenChange', UI.exitFullscreen, false);
	document.getElementById('reload').addEventListener('click', () => UI.reload(data.sound));
	document.getElementById('present').addEventListener('click', UI.toggleFullScreen);
	bindMoM_slider();
	window.PE = PE;
	window.UI = UI;
	window.constants = constants;
	window.get_last_trade = get_last_trade;
};
function bindMoM_slider() {
	document.getElementById('thoma').addEventListener('input', (e) => {
		if (e.target && e.target.name === 'MoM_range') {
			console.log('MoM_range', e.target.value);
			const target_price = PE.calc_target_price(
				e.target.value,
				data.investment,
				data.realized,
				data.current_shares
			);
			// Update the output elements
			const form = e.target.closest('form');
			const targetOutput = form.querySelector('output[name="target"]');
			const priceOutput = form.querySelector('output[name="price_required"]');
			targetOutput.value = e.target.value;
			priceOutput.value = numeral(target_price).format('$0.00');
		}
	});
};

function initApp() {
	parseURLs();
	bindUIEvents();
};
initApp();

export { get_closing_prices, get_market_status };