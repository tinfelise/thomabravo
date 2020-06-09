var finance = new Finance();
var million = 1000000;

var stock_data = {};
var current_price, previous_closing_price;

var investment, realized, unrealized;
var all_realizations = [];

var current_shares, fdso;

function get_stock_price (ticker) {
	var alphavantage_key = 'B67FR48WBLNMCCHH';
	var path = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + ticker +
	'&apikey=' + alphavantage_key;
	var settings = {
		url: path,
		beforeSend: function () {
			console.log('Fetching stock data from...')
			console.log(path);
			$('#ticker').html(ticker);
			// $('#AlphaVantage').attr('href', path);
		},
		error: function () {
			no_data();
		},
		success: function (data) {
			parse_stock_data(data);
		}
	};
	$.ajax(settings)
};
function reset () {
	all_realizations = [];
	$('#MoM_targets').remove();
};
function reload (clip) {
	$('body').removeClass('loaded');
	reset();
	get_stock_price(ticker);
	if (clip) {
		play_sound(clip);
	};
};

function no_data () {
	console.log('AlphaVantage did not return data.');
	$('main').addClass('loaded');
	$('#stockData .data').html('<h1>Data unavailable</h1><span>Please try again later</span>');
};

function display_update_time (date, time, open) {
	var html = 'As of ';
	if (open) {
		var date_time = date + ' ' + time;
		html += moment(date_time, 'YYYY-MM-DD LTS').format('h:mmA');
	} else {
		var exchange_open = moment('9:30 AM -05:00', 'LT Z');
		var exchange_close = moment('4:00 PM -05:00', 'LT Z');
		if ( moment().isBetween(exchange_open, exchange_close) == false ) {
			html += 'closing ';
		}
		html += moment(date, 'YYYY-MM-DD').format('MMM. Do');
	};
	$('#updated').html(html);
};
function display_previous_day_of_week (date) {
	var days_ago = moment(date).diff(moment(), 'days');
	var weekday = 'yesterday';
	if (days_ago != -1) {
		weekday = moment(date).format('dddd');
	};
	$('#previous_weekday').html('from ' + weekday);
};

function parse_stock_data (data) {
	stock_data = data['Global Quote'];
	// var markets_open = false;
	// console.log(meta_data);
	var last_updated = '07. latest trading day';
		last_updated = stock_data[last_updated];
	console.log('As of ' + last_updated);

	// var last_updated_date = last_updated;
	// if ( last_updated.split(' ').length > 1 ) {
	// 	markets_open = true;
	// 	last_updated_date = last_updated.split(' ')[0];
	// 	var last_updated_time = last_updated.split(' ')[1];
	// 		last_updated_time = last_updated_time + '-05:00'; // EST timezone offset
	// };

	// stock_data = data['Time Series (Daily)'];
	// var todays_data = stock_data[last_updated_date];

	// var previous = Object.keys(stock_data)[1];
	// var yesterdays_data = stock_data[previous];

	var price = '05. price';
	current_price = stock_data[price];

	var previous_close ='08. previous close';
	previous_closing_price = stock_data[previous_close];

	// display_update_time(last_updated_date, last_updated_time, markets_open);
	// display_previous_day_of_week(moment(previous, 'YYYY-MM-DD'));
	do_the_math(current_price, previous_closing_price);
};

function percentage_change (current, previous) {
	var diff = current - previous;
	var percentage_change = diff/previous;
		percentage_change = numeral(percentage_change).format('0.0%');
	return percentage_change;
};

function get_IRR (realizations) {
	var amounts = [];
	var dates = [];
	for (i in realizations) {
		amounts[i] = realizations[i].amount * million;
		var date = moment(realizations[i].date, 'MM/DD/YY');
		var year = moment(date).format('YYYY');
		var month = moment(date).format('MM');
		var day = moment(date).format('DD');
		dates[i] = new Date(year, month, day);
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
function add_new_realizations (array) {
	for (obj in array) {
		all_realizations.push(array[obj]);
	};
	order_events(all_realizations, 'MM/DD/YY');
};
function calc_MoM (gains) {
	return gains / investment;
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

function get_TB_shares_perc (TB_shares, total_shares) {
	var perc_stake = TB_shares / (total_shares * million);
	var stake_html = numeral(perc_stake).format('0.0%') + ' <span>FDSO</span>';
	$('#TB_perc_stake').html(stake_html);

	var perc_realized = 1 - ( TB_shares/ (TB_preIPO_shares * million) );
	var perc_realized_html = numeral(perc_realized).format('0.0%') + ' <span>Realized</span>';
	$('#TB_perc_shares_realized').html(perc_realized_html);
};
function get_TB_shares_value (shares) {
	$('#TB_shares').html( numeral(shares).format('0.0a') + ' <span>Shares</span>' );
	var TB_shares_value = shares * current_price;
	$('#TB_shares_value').html( numeral(TB_shares_value).format('$0.0a') + ' <span>Value</span>' );
	calc_unrealized(TB_shares_value);
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
function total_gains_MoM (realizations) {
	sum_transactions(transactions);
	
	var total_returns = realized + unrealized;
	var total_MoM = calc_MoM(total_returns);
	var total_gain = total_returns - investment;

	$('#realized').html('<h2>' + numeral(realized).format('$0,0.0a') + '</h2>');
	$('#realized').append('<div class="MoM"><span>' + numeral( calc_MoM(realized) ).format('0[.]00') + 'x</span> MoM</div>');

	$('#unrealized').html('<h2>' + numeral(unrealized).format('$0,0.0a') + '</h2>');
	$('#unrealized').append('<div class="MoM"><span>' + numeral( calc_MoM(unrealized) ).format('0[.]00') + 'x</span> MoM</div>');

	$('#total_returns').html('<h2>' + numeral(total_returns).format('$0,0.0a') + '</h2>');
	$('#total_returns').append('<div class="MoM"><span>' + numeral( calc_MoM(total_returns) ).format('0[.]00') + 'x</span> MoM</div>');

	$('#total_gain label').html( numeral(total_gain).format('$0,0.0a') );
};
function create_revenue_multiple (enterprise_value, amount, year, type) {
	var multiple = enterprise_value / (amount * million);
	var output = '<h3 class="multiple">'
		+ numeral(multiple).format('0.00') + 'x'
		+ ' <span>' + year + ' ' + type +'</span>'
		+ '</h3>';
	return output;
};
function get_revenue_multiples (enterprise_value) {
	var html = '';
	// why doesn'ts if (revenues) work?!?
	if (typeof revenues !== 'undefined') {
		for (i in revenues) {
			html += create_revenue_multiple (enterprise_value, revenues[i], i, 'Revenues');
		};
	} else if (ebitdas) {
		for (i in ebitdas) {
			html += create_revenue_multiple (enterprise_value, ebitdas[i], i, 'EBITDA');
		};
	};
	if (typeof uFCF !== 'undefined') {
		for (i in uFCF) {
			html += create_revenue_multiple (enterprise_value, uFCF[i], i, 'uFCF');
		};
	};
	$('#revenues_multiples').html(html);
};
function get_enterprise_value (market_cap) {
	var enterprise_value = market_cap + (net_debt * million);
	$('#enterprise_value').html(numeral(enterprise_value).format('($0.00a)') + ' <span>Enterprise Value</span>');
	get_revenue_multiples(enterprise_value);
};
function get_market_cap (RSUs) {
	fdso = 0;
	for (i in share_count_build) {
		fdso += share_count_build[i];
	};
	fdso += RSUs;
	var market_cap = fdso * current_price * million;
	$('#market_cap').html(numeral(market_cap).format('($0.00a)') + ' <span>Market Cap</span>');
	get_enterprise_value(market_cap);
};
function dilute_shares(options) {
	var RSUs_Options = 0;
	for (issuance in options) {
		var strike_price = options[issuance].strike;
		var shares = options[issuance].shares;
		var diluted = 0;
		if (current_price > strike_price) {
			diluted = (current_price - strike_price)/current_price*shares;
		};
		RSUs_Options += diluted;
	};
	get_market_cap(RSUs_Options);
};

function do_the_math (current_price, price_yesterday) {
	var compared_to_yesterday = current_price - price_yesterday;
	var stock_class = 'up';
	var icon = 'fa-chart-line';
	if (compared_to_yesterday < 0) {
		stock_class = 'down';
		icon = 'fa-chart-area';
	};
	var compared_to_yesterday_perc = percentage_change(current_price,price_yesterday);

	$('body').addClass('loaded');
	$('#current_price').html( numeral(current_price).format('$0,0.00') );
	$('#price_changes').addClass(stock_class);
	$('#price_changes svg').remove();
	$('#price_changes').prepend('<i class="fas ' + icon + '"></i>');		
	$('#compared_to_yesterday').html( numeral(compared_to_yesterday).format('$0,0[.]00') );
	$('#compared_to_yesterday_perc').html('(' + compared_to_yesterday_perc + ')');

	dilute_shares(options_build);
	total_gains_MoM(transactions);
	get_TB_shares_perc(current_shares, fdso);
	check_for_MoM_slider();
	check_for_disclaimer();
};

function get_target_price (target_MoM, label, output) {
	var target_price = calc_target_price(target_MoM);
	label.value = target_MoM;
	output.value = numeral(target_price).format('$0.00');
};
function calc_target_price (target_MoM) {
	var equity = target_MoM * investment;
	var trading_value = equity - realized;
	var target_price = trading_value / current_shares;
	return target_price;
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
function check_for_MoM_slider () {
	if ( typeof MoM_slider !== 'undefined') {
		create_MoM_slider (MoM_slider['min'], MoM_slider['max'], MoM_slider['increment']);
	};
};
function add_disclaimer () {
	var html = "<p class='disclaimer'>" + disclaimer + '</p>';
	$('#total_gain').append(html);	
};
function check_for_disclaimer () {
	if ( typeof disclaimer != 'undefined') {
		add_disclaimer ();
	};
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
	display_update_time(today, time, open);
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
		get_stock_price(ticker);
	};
};

function parseURLs() {
	var currentURL = window.location.href;
		currentURL = currentURL.split('?')[1];
	if (currentURL) {
		currentURL = currentURL.split('&');
	};
	var parameters = {};
	for (i in currentURL) {
		var key = currentURL[i].split('=')[0];
		var val = currentURL[i].split('=')[1];
		parameters[key] = val;
	};
	check_for_tests(parameters);
};
parseURLs();

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
if (document.addEventListener) {
	document.addEventListener('webkitfullscreenchange', exitFullscreen, false);
	document.addEventListener('mozfullscreenchange', exitFullscreen, false);
	document.addEventListener('fullscreenchange', exitFullscreen, false);
	document.addEventListener('MSFullscreenChange', exitFullscreen, false);
};
function exitFullscreen() {
	if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
		$('html').removeClass('fullscreen');
		stop_refreshing();
	}
};

var refresh_interval;
function auto_refresh(seconds) {
	var time = seconds * 1000;
	refresh_interval = setInterval(reload, time); 
};
function stop_refreshing() {
	clearInterval(refresh_interval);
}