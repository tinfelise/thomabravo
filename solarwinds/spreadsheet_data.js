var ticker = 'SWI';
// var sound = 'sail.mp3';

var MoM_slider = {
	'min': 1.5,
	'max': 3,
	'increment': .25
};

var options_build = [
	{
		'tranche': 1,
		'strike': 0,
		'shares': 0
	},
	{
		'tranche': 2,
		'strike': 1.6,
		'shares': 2.921925
	},
	{
		'tranche': 3,
		'strike': 0,
		'shares': 0
	},
	{
		'tranche': 4,
		'strike': 0,
		'shares': 6.216511
	},
	{
		'tranche': 5,
		'strike': 0,
		'shares': 0.90159
	}
];

var share_count_build = {
	'Basic Shares': 311.180888,
	'Pref-Shares': 0,
	'IPO Shares': 0,
	'Greenshoe Shares': 0
};

var ebitdas = {
	'2020': 503.29,
	'2021': 563.02
};
var uFCF = {
	'2020': ebitdas[2019]*0.9,
	'2021': ebitdas[2020]*0.9
};
var net_debt = 1896.062+19.9-221.06;

var TB_preIPO_shares = 112.129322730121;
var transactions = [
	{
		'event':'Purchase',
		'date': '2/5/16',
		'amount': -1010,
		'shares': TB_preIPO_shares
	},
	{
		'event':'LNOW Purchase',
		'date': '5/31/16',
		'amount': -78.4640319999999
	},
	{
		'event':'Transaction Fees',
		'date': '3/31/16',
		'amount': 0.8
	},
	{
		'event':'Transaction Fees',
		'date': '6/30/16',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '9/30/16',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '12/31/16',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '3/31/17',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '6/30/17',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '9/30/17',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '12/31/17',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '3/31/18',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '6/30/18',
		'amount': 1.25
	},
	{
		'event':'Transaction Fees',
		'date': '9/30/18',
		'amount': 1.25
	},
	{
		'event':'First Follow On',
		'date': '5/22/19',
		'amount': 6.10887 * 17.42,
		'shares': -6.10887
	}
];