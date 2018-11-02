var finance = new Finance();
var million = 1000000;

var stock_data = {};
var current_price, previous_closing_price;

var investment, realized, unrealized;
var all_realizations = [];

var current_shares, fdso;

function get_stock_price (ticker) {
	var alphavantage_key = 'B67FR48WBLNMCCHH';
	var path = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + ticker +
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

function previous_weekday (date) {
	var day = date;
	var day_of_week = moment(date).format('E');
	if (day_of_week > 5) {
		var offset = day_of_week - 5;
		day = moment(date).subtract(offset, 'days');
	};
	return day;
};
function check_holiday (date) {
	var new_date = date;
	var is_today_holiday = moment(date).isHoliday();
	var is_yesterday_holiday = moment(date).subtract(1, 'days').isHoliday();
	
	if (is_today_holiday && is_yesterday_holiday) {
		new_date = moment(date).subtract(2, 'days');
	} else if (is_today_holiday) {
		new_date = moment(date).subtract(1, 'days');
	};

	new_date = previous_weekday(new_date);
	return new_date;
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
function previous_market_day(date, date_format) {
	var day_before = moment(date, date_format).subtract(1, 'days');
	day_before = previous_weekday(day_before);
	day_before = check_holiday(day_before);
	return moment(day_before).format('YYYY-MM-DD');
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
	var meta_data = data['Meta Data'];
	var markets_open = false;
	var last_updated = '3. Last Refreshed';
		last_updated = meta_data[last_updated];
	console.log('As of ' + last_updated);

	var last_updated_date = last_updated;
	if ( last_updated.split(' ').length > 1 ) {
		markets_open = true;
		last_updated_date = last_updated.split(' ')[0];
		var last_updated_time = last_updated.split(' ')[1];
			last_updated_time = last_updated_time + '-05:00'; // EST timezone offset
	};

	var previous = previous_market_day(last_updated_date, 'YYYY-MM-DD');

	stock_data = data['Time Series (Daily)'];
	var todays_data = stock_data[last_updated_date];
	var yesterdays_data = stock_data[previous];

	var close = '4. close';
	current_price = todays_data[close];
	previous_closing_price = yesterdays_data[close];

	display_update_time(last_updated_date, last_updated_time, markets_open);
	display_previous_day_of_week(moment(previous, 'YYYY-MM-DD'));
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
	get_IRR(all_realizations);
};

function get_TB_shares_perc (TB_shares, total_shares) {
	var TB_shares_perc = TB_shares / (total_shares * million);
	var html = numeral(TB_shares_perc).format('0.0%') + ' <span>Stake</span>';
	$('#TB_shares_perc').html(html);
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
function get_revenue_multiples (enterprise_value) {
	var html = '';
	for (i in revenues) {
		var multiple = enterprise_value / (revenues[i] * million);
		html += '<h3 class="multiple">'
				+ numeral(multiple).format('0.00') + 'x'
				+ ' <span>' + i + ' Revenues</span>'
				+ '</h3>';
	};
	$('#revenues').html(html);
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
	get_TB_shares_perc(current_shares, share_count_build["Basic Shares"]);
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
	}
};

var refreshInterval;

function refresh(time) {
	refreshInterval = setInterval(reload, time); 
};
function stopRefreshing() {
	clearInterval(refreshInterval);
}