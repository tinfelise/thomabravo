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
		'strike': 1.69,
		'shares': 1.996568
	},
	{
		'tranche': 3,
		'strike': 0,
		'shares': 0
	},
	{
		'tranche': 4,
		'strike': 0,
		'shares': 13.329008
	}
];

var share_count_build = {
	'Basic Shares': 314.042117,
	'Pref-Shares': 0,
	'IPO Shares': 0,
	'Greenshoe Shares': 0
};

var ebitdas = {
	'2021': 527.65,
	'2022': 587.89
};
var uFCF = {
	'2021': ebitdas[2021]*0.9,
	'2022': ebitdas[2022]*0.9
};
var net_debt = 1935.275-424.986;

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
	},
	{
		'event':'Private Placement',
		'date': '12/9/20',
		'amount': 128.3,
		'shares': -5.839157
	}
];