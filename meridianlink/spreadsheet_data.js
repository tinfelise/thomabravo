var ticker = 'MLNK';
// var sound = 'sail.mp3';

var IPO_price = 26;

var MoM_slider = {
	'min': 5.5,
	'max': 10,
	'increment': .5
};

var share_count_build = {
	'Basic Shares': 80.704569,
	'IPO Shares': 0,
	'Greenshoe Shares': 0
};

var revenues = {
	'2021': 252.4,
	'2022': 281.2
};
var ebitdas = {
	'2021': 109.7,
	'2022': 114.8
};

var net_debt = 361;

var options_build = [
	{
		'tranche': 1,
		'strike': 6.44,
		'shares': 3.207196
	},
	{
		'tranche': 2,
		'strike': 0,
		'shares': 1.024629
	},
	{
		'tranche': 3,
		'strike': 0,
		'shares': 0.108957
	}
];

var transactions = [
	{
		'event':'Purchase (TB Tranche I)',
		'date': '5/31/18',
		'amount': -190,
		'shares': 38.447344
	},
	{
		'event':'Purchase (TB Tranche II)',
		'date': '6/7/18',
		'amount': -10,
		'shares': 2.015902
	}
];
var TB_preIPO_shares = transactions[0].shares + transactions[1].shares