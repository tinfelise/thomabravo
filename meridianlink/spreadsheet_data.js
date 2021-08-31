var ticker = 'MLNK';
// var sound = 'sail.mp3';

var IPO_price = 26;

var MoM_slider = {
	'min': 4,
	'max': 8,
	'increment': .55
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

var TB_preIPO_shares = 40.463246;
var transactions = [
	{
		'event':'Purchase (TB Tranche I)',
		'date': '5/31/18',
		'amount': -200,
		'shares': TB_preIPO_shares
	}
];