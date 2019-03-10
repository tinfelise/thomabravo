var ticker = 'SWI';
// var sound = 'sail.mp3';

var options_build = [
	{
		'tranche': 1,
		'strike': 0,
		'shares': 0
	},
	{
		'tranche': 2,
		'strike': 1.62,
		'shares': 3.1148
	},
	{
		'tranche': 3,
		'strike': 0,
		'shares': 0
	},
	{
		'tranche': 4,
		'strike': 0,
		'shares': 6.277466
	}
];

var share_count_build = {
	'Basic Shares': 309.942574,
	'Pref-Shares': 0,
	'IPO Shares': 0,
	'Greenshoe Shares': 0
};

var ebitdas = {
	// '2018': 402.7,
	'2019': 452,
	'2020': 505
};
var uFCF = {
	'2019': 407,
	'2020': 455
};
var net_debt = 1904.072-382.62;

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
	}
];