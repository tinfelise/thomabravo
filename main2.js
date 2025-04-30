import { PE } from './finance.js';

const finance = new Finance();
const million = 1000000;

var stock_data = {};
var time_series_data = {};
var time_series_dates = {};
let current_price, previous_closing_price;

let investment, realized, unrealized;
var all_realizations = [];

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
		last_updated = Math.round(last_updated / million);
	$('#ticker').html(ticker);
	display_updated_time(last_updated, 'x', market_status);
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
	display_previous_day_of_week(closing_data.t, 'x');
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
function display_updated_time (timestamp, format, market_status) {
	var html = 'As Of ';
	if (market_status == 'closed') { // can also add extended hours
		html += 'Closing ';
	};
	html += moment(timestamp, format).format('MMM.\u00A0Do\u00A0h:mma\u00A0z');
	$('#updated').html(html);
};
function display_previous_day_of_week (date, format) {
	var days_ago = moment(date, format).diff(moment(), 'days');
	if ( isNaN(days_ago) == false ) {
		var weekday = 'yesterday';
		if (days_ago != -1) {
			weekday = moment(date, format).format('dddd');
		};
		$('#previous_weekday').html('from ' + weekday);	
	};
};

function percentage_change (current, previous) {
	const diff = current - previous;
	const percentage_change = diff/previous;
	return numeral(percentage_change).format('0.0%');
};

function return_date (format, date_string) {
	var date = moment(date_string, format);
	var year = moment(date).format('YYYY');
	var month = moment(date).format('MM');
	var day = moment(date).format('DD');
	return new Date(year, month, day);
};
function get_IRR (realizations) {
	var amounts = [];
	var dates = [];
	for (i in realizations) {
		amounts[i] = realizations[i].amount * million;
		dates[i] = return_date('MM/DD/YY',realizations[i].date);
	};
	var XIRR = finance.XIRR(amounts, dates) / 100;
	$('#IRR').html( numeral(XIRR).format('0,0[.]0%') + ' <span>IRR</span>' );
};
function order_events (events, format) {
	events = events.sort(function (a, b) {
    	return moment(a.date, format).format('x')
    		.localeCompare(
    			moment(b.date, format).format('x')
			);
	});
};
function calc_MoM (gains) {
	return gains / investment;
};

function total_gains_MoM (realizations) {
	sum_transactions(transactions);
	
	const total_returns = realized + unrealized;
	const total_MoM = calc_MoM(total_returns);
	const total_gain = total_returns - investment;

	$('#realized').html('<h2>' + numeral(realized).format('$0,0.0a') + '</h2>');
	$('#realized').append('<div class="MoM"><span>' + numeral( calc_MoM(realized) ).format('0[.]00') + 'x</span> MoM</div>');

	$('#unrealized').html('<h2>' + numeral(unrealized).format('$0,0.0a') + '</h2>');
	$('#unrealized').append('<div class="MoM"><span>' + numeral( calc_MoM(unrealized) ).format('0[.]00') + 'x</span> MoM</div>');

	$('#total_returns').html('<h2>' + numeral(total_returns).format('$0,0.0a') + '</h2>');
	$('#total_returns').append('<div class="MoM"><span>' + numeral( calc_MoM(total_returns) ).format('0[.]00') + 'x</span> MoM</div>');

	$('#total_gain label').html( numeral(total_gain).format('$0,0.0a') );
};
function sum_transactions (all_transactions) {
	realized = 0;
	investment = 0;
	current_shares = 0;
	for (i in all_transactions) {
		var value = all_transactions[i].amount
		if (value > 0) {
			realized += value * million;
		} else {
			investment += -value * million;
		};

		var shares = all_transactions[i].shares;
		if (shares) {
			current_shares += shares * million;
		};
	};
	get_TB_shares_value(current_shares);
};
function get_TB_shares_value (shares) {
	const TB_shares_value = shares * current_price;
	$('#TB_shares_value').html( numeral(TB_shares_value).format('$0.0a') + ' <span>Value</span>' );
	calc_unrealized(TB_shares_value);
};
function calc_unrealized(share_value) {
	unrealized = share_value;
	var IPO_mark = {
		'event': 'IPO Mark',
		'date': moment().format('MM/DD/YY'),
		'amount': (share_value / million)
	};
	add_new_realizations(transactions);
	add_new_realizations([IPO_mark]);
	order_events(all_realizations, 'MM/DD/YY');
	get_IRR(all_realizations);
};
function add_new_realizations (array) {
	for (obj in array) {
		all_realizations.push(array[obj]);
	};
	order_events(all_realizations, 'MM/DD/YY');
};

// Valuation Metrics & Revenue Multiples
function get_market_cap (price, fdso) {
	const market_cap = fdso * price * million;
	return market_cap;
};
function get_enterprise_value (market_cap, net_debt) {
	const enterprise_value = market_cap + (net_debt * million);
	return enterprise_value;
};
function display_valuation_metrics (price, fdso, net_debt, multiples) {
	const market_cap_value = get_market_cap(price, fdso);
	const enterprise_value = get_enterprise_value(market_cap_value, net_debt);
	$('#market_cap').html(numeral(market_cap_value).format('($0.00a)') + ' <span>Market Cap</span>');
	$('#enterprise_value').html(numeral(enterprise_value).format('($0.00a)') + ' <span>Enterprise Value</span>');
	get_revenue_multiples(enterprise_value, multiples);
};
function get_revenue_multiples (enterprise_value, all_multiples) {
	let html = '';
	for (let multiple in all_multiples) {
		for (let year in all_multiples[multiple].years) {
			html += create_revenue_multiple (enterprise_value, all_multiples[multiple].years[year], year, all_multiples[multiple].type);
		};
	};
	$('#revenues_multiples').html(html);
};
function create_revenue_multiple (enterprise_value, amount, year, type) {
	const multiple = enterprise_value / (amount * million);
	const output = '<h3 class="multiple">'
		+ numeral(multiple).format('0.00') + 'x'
		+ ' <span>' + year + ' ' + type +'</span>'
		+ '</h3>';
	return output;
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

function do_the_math (current_price, price_yesterday) {
	const compared_to_yesterday = current_price - price_yesterday;
	const compared_to_yesterday_perc = percentage_change(current_price,price_yesterday);
	display_current_price(current_price, compared_to_yesterday, compared_to_yesterday_perc);
	check_IPO_price(current_price); 
	display_valuation_metrics(current_price, data.FDSO, data.net_debt, data.multiples);
	// below should be broken out by ownership group
	get_money_types(data.transactions);
	display_ownership_metrics(data.current_shares);
	// total_gains_MoM(data.transactions); 
	// check_for_MoM_slider(); 
	check_for_disclaimer();
};

function get_money_types(transactions) {
    const money_types = [...new Set(transactions.map(t => t.money))];\

	if (money_types.length > 1) {
		console.log('Multiple money types found.');
	};
    return money_types;
};

function display_ownership_metrics (shares) {
	PE.get_current_shares(shares); 
	const shares_value = PE.get_shares_value(shares, current_price);
	display_shares_value(shares_value);
	// calc_unrealized(TB_shares_value);
	// TB_perc_shares_realized
	// IRR
}
function display_shares_value (shares_value) {
	$('#TB_shares_value').html( numeral(shares_value).format('$0.0a') + ' <span>Value</span>' );
}

function display_current_price (price, daily_change, percent_change) {
	let stock_class = 'up';
	let icon = 'fa-chart-line';
	if (daily_change < 0) {
		stock_class = 'down';
		icon = 'fa-chart-area';
	};
	$('body').addClass('loaded');
	$('#current_price').html( numeral(price).format('$0,0.00') );
	$('#price_changes').addClass(stock_class);
	$('#price_changes svg').remove();
	$('#price_changes').prepend('<i class="fas ' + icon + '"></i>');
	$('#compared_to_yesterday').html( numeral(daily_change).format('$0,0[.]00') );
	$('#compared_to_yesterday_perc').html('(' + percent_change + ')');
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
	const dates = [return_date('M/D/YY',IPO.date),return_date()];
	const XIRR = finance.XIRR(amounts, dates) / 100;
	display_IPO_price(IPO.price, IPO_change, XIRR);
};
function display_IPO_price (price, change, IRR) {
	let html = '<div id="IPO_change">';
	if (change >= 0) {
		html += 'Up ';
	} else {
		html += 'Down ';
	};
	html += numeral(Math.abs(change)).format('%0,0.0');
	html += ' From ';
	html += numeral(price).format('$0,0');
	html += ' Initial Listing (';
	html += numeral(IRR).format('%0,0.0');
	html += ' IRR)</div>';
	$('#IPO_change').remove();
	$('#stockData > div:first-of-type').append(html);
};

// MoM Target Price
function check_for_MoM_slider () {
	if ( typeof data.MoM_slider !== 'undefined') {
		create_MoM_slider (data.MoM_slider['min'], data.MoM_slider['max'], data.MoM_slider['increment']);
	};
};
function create_MoM_slider (min, max, increment) {
	var starting_value = calc_target_price(min);
		starting_value = numeral(starting_value).format('$0.00');
	var html = "<form id='MoM_targets' oninput='get_target_price(MoM_range.value, target, price_required)'>";
		html += '<p>Illustrative Share Price To Achieve MoM</p>';
		html += "<span><output name='target' for='MoM_range'>" + min + "</output>x <span>MoM</span></span>";
		html += "<input type='range' name='MoM_range' min='" + min + "' max='" + max + "' value='" + min + "' step='" + increment + "'>";
		html += "<span><output name='price_required' for='MoM_range'>" + starting_value + "</output> <span>Target Price</span></span>"
	$('#total_gain').append(html);
};
function calc_target_price (target_MoM) {
	var equity = target_MoM * investment;
	var trading_value = equity - realized;
	var target_price = trading_value / current_shares;
	return target_price;
};
function get_target_price (target_MoM, label, output) {
	var target_price = calc_target_price(target_MoM);
	label.value = target_MoM;
	output.value = numeral(target_price).format('$0.00');
};

// Disclaimer
function add_disclaimer (disclaimer) {
	$('#returns_disclaimer').remove();
	var html = "<p id='returns_disclaimer' class='disclaimer'>" + disclaimer + '</p>';
	$('#total_gain').append(html);	
};
function check_for_disclaimer () {
	if ( typeof data.disclaimer != 'undefined') {
		add_disclaimer (data.disclaimer);
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
		create_chart(time_series_data,time_series_dates);
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
function create_chart (dataset, data_labels) {
	$('#returns_over_time').remove();
	var html = '<canvas id="returns_over_time" width="400" height="400"></canvas>'
	$('#total_gain').append(html);
	
	var ctx = $('#returns_over_time');
	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: data_labels,
			datasets: [{
				label: 'Stock Price',
				data: get_closing_prices(dataset, data_labels),
				borderColor: 'rgba(255, 255, 255, .75)',
				backgroundColor: 'rgba(0,0,0,0)'
			}]
		},
		options: {
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					type: 'time',
					time: {
					    unit: 'month'
					},
					ticks: {
						fontColor: 'rgba(255, 255, 255, .5)',
						fontFamily: "'Akkurat', -apple-system, BlinkMacSystemFont, Helvetica, sans-serif",
						fontSize: '16'
					},
					gridLines: {
						display: false
					}
				}],
				yAxes: [{
				    ticks: {
				        // Include a dollar sign in the ticks
				        callback: function(value, index, values) {
				            return '$' + value;
				        },
				        fontColor: 'rgba(255, 255, 255, .5)',
				        fontSize: '16'
				    },
				    gridLines: {
				        display: false
				    }
				}]
	        },
			tooltips: {
				enabled: false
			},
			elements: {
			    point:{
			        radius: 0
			    }
			}
		}
	});
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
				create_article(article, ticker);
			};
		};
	};
};
function create_article (article, ticker) {
	var html = '<a href="' + article.article_url + '" target="_blank">';
	html +='<h3>' + article.title + '</h3>';
	html += '<span>' + article.author + ' | ' + article.publisher.name + ' | ' + moment(article.published_utc).format("MMM D, 'YY") + '</span>';
	if (article.insights) {
		for (let ins in article.insights) {
			const insight = article.insights[ins];
			if (insight.ticker == ticker && insight.sentiment != 'neutral') {
				let sentiment = 'bear.svg';
				if (insight.sentiment == 'positive') {
					sentiment = 'bull.svg';
				};
				html += '<img src="../images/' + sentiment + '" alt="' + insight.sentiment + '">';
				html += '<p>' + insight.sentiment_reasoning + '</p>';
			};
		};
	};
	html += '</a>';
	$('#news').append(html);
};

// Tests
function dummy_data (tick, current, last, message) {
	current_price = current;
	previous_closing_price = last;
	var today = moment().format('YYYY-MM-DD');
	var time = moment().format('h:mmA');
	var open = true;
	var previous = previous_market_day(today, 'YYYY-MM-DD');

	$('#ticker').html(tick);
	$('header button').hide();
	// display_update_time(today, time, open);
	display_previous_day_of_week(moment(previous, 'YYYY-MM-DD'));
	do_the_math(current_price, previous_closing_price);
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
function reset () {
	all_realizations = [];
	$('#MoM_targets').remove();
};
function reload (clip) {
	$('body').removeClass('loaded');
	reset();
	get_market_status(data.ticker);
	if (clip) {
		play_sound(clip);
	};
};
function play_sound(clip) {
	var audioElement = document.createElement('audio');
	audioElement.setAttribute('src', clip);
	audioElement.play();
};

function toggleFullScreen() {
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl);
		$('html').addClass('fullscreen');
		auto_refresh(60);
	}
	else {
		cancelFullScreen.call(doc);
	}
};

function exitFullscreen() {
	if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
		$('html').removeClass('fullscreen');
		stop_refreshing();
	};
};

function auto_refresh(seconds) {
	var time = seconds * 1000;
	refresh_interval = setInterval(reload, time); 
};
function stop_refreshing() {
	clearInterval(refresh_interval);
};
  
function bindUIEvents() {
	document.addEventListener('webkitfullscreenchange', exitFullscreen, false);
	document.addEventListener('mozfullscreenchange', exitFullscreen, false);
	document.addEventListener('fullscreenchange', exitFullscreen, false);
	document.addEventListener('MSFullscreenChange', exitFullscreen, false);
	document.getElementById('reload').addEventListener('click', () => reload(data.sound));
	document.getElementById('present').addEventListener('click', toggleFullScreen);
	window.PE = PE;
	window.get_last_trade = get_last_trade;
};

function initApp() {
	parseURLs();
	bindUIEvents();
};
initApp();