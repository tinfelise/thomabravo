import { PE, stock } from './src/finance.js';
import { UI } from './src/ui.js';
import { constants } from './src/constants.js';
import { PolygonAPI, AlphaVantageAPI } from './src/api.js';
const finance = new Finance();

let time_series_data = {};
let time_series_dates = {};
let current_price, previous_closing_price;

let AppState = [];

// let refresh_interval;

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


// Valuation Metrics & Revenue Multiples
function display_valuation_metrics (price, fdso, net_debt, multiples) {
	const market_cap_value = stock.get_market_cap(price, fdso);
	const enterprise_value = stock.get_enterprise_value(market_cap_value, net_debt);
	const revenue_multiples = stock.calculate_revenue_multiples(enterprise_value, multiples);
	$('#market_cap').html(numeral(market_cap_value).format('($0.00a)') + ' <span>Market Cap</span>');
	$('#enterprise_value').html(numeral(enterprise_value).format('($0.00a)') + ' <span>Enterprise Value</span>');
	$('#revenues_multiples').html(display_revenue_multiples(revenue_multiples));
};
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




async function do_the_math (current_price, price_yesterday) {
	const compared_to_yesterday = current_price - price_yesterday;
	const compared_to_yesterday_perc = constants.percentage_change(current_price,price_yesterday);
	UI.display_current_price(current_price, compared_to_yesterday, compared_to_yesterday_perc);
	check_IPO_price(current_price); 
	display_valuation_metrics(current_price, data.FDSO, data.net_debt, data.multiples);
	const money_types = PE.get_money_types(data.transactions);
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
	const chartData = await get_chart_data_to_date(data.IPO.date);
	UI.create_chart(chartData.closing_prices, chartData.dates);
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
		parsed_data.market_cap = stock.get_market_cap(parsed_data.current_price, comp.FDSO);
		parsed_data.enterprise_value = stock.get_enterprise_value(parsed_data.market_cap, comp.net_debt);
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
async function get_chart_data_to_date (start_date) {
	var start_date = moment(start_date, 'MM/DD/YY').format('YYYY-MM-DD');
	var end_date = moment().format('YYYY-MM-DD');
	try {
		const response = await PolygonAPI.getAggregates(data.ticker, start_date, end_date);
		const aggregates = response.results || [];
		const closing_prices = aggregates.map(aggregate => aggregate.c);
		const dates = aggregates.map(aggregate => aggregate.t);
		console.log('Aggregates:', aggregates);
		return { closing_prices, dates };
	} catch (error) {
		console.error('Error fetching chart data:', error);
	}
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
		// get_polygon_news(data.ticker, 100);
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
// function auto_refresh(seconds) {
// 	var time = seconds * 1000;
// 	refresh_interval = setInterval(UI.reload, time); 
// };
// function stop_refreshing() {
// 	clearInterval(refresh_interval);
// };
  
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
			// Get the currently visible section ID
			const visibleSection = document.querySelector('#thoma > section:not([style*="display: none"])');
			const groupId = visibleSection ? visibleSection.id : 'All';
			
			// Find the metrics for this group in AppState
			const metrics = AppState.find(state => state.group === groupId);
			console.log('metrics', metrics);
			if (metrics) {
				const target_price = PE.calc_target_price(
					e.target.value,
					metrics.investment,
					metrics.realized,
					metrics.shares
				);
				// Update the output elements
				const form = e.target.closest('form');
				const targetOutput = form.querySelector('output[name="target"]');
				const priceOutput = form.querySelector('output[name="price_required"]');
				targetOutput.value = e.target.value;
				priceOutput.value = numeral(target_price).format('$0.00');
			}
		}
	});
};

function initApp() {
	parseURLs();
	UI.init();
	bindUIEvents();
};
initApp();

export { get_market_status, AppState };
window.AppState = AppState;