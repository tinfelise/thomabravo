var ticker = 'MCFE';
var sound = 'Rollin.m4a';

var share_count_build = {
	'Basic Shares': 157.32499+267.065127,
	'IPO Shares': 0,
	'Greenshoe Shares': 0
};

var revenues = {
	'2020': 2870.5,
	'2021': 2955.4
};
var ebitdas = {
	'2021': 1034.4,
	'2022': 1113.3
};
var uFCF = {
	'2020': 909.8,
	'2021': 1005
};
var net_debt = 4757-348;

var options_build = [
	{
		'tranche': 1,
		'strike': 20.00,
		'shares': 1.9
	},
	{
		'tranche': 2,
		'strike': 0,
		'shares': 5.7
	},
	{
		'tranche': 3,
		'strike': 0,
		'shares': 17.5
	},
	{
		'tranche': 4,
		'strike': 0,
		'shares': 20
	}
];

var MoM_slider = {
	'min': 3,
	'max': 7,
	'increment': .5
};

var TB_preIPO_shares = 43.995205;
var transactions = [
	{
		'event':'Purchase',
		'date': '4/3/17',
		'amount': -250,
		'shares': TB_preIPO_shares
	},
	{
		'event':'Realization',
		'date': '9/29/17',
		'amount': 170.50 
	},
	{
		'event':'Transaction Fees',
		'date': '10/4/17',
		'amount': 0.208319
	},
	{
		'event':'Transaction Fees',
		'date': '1/5/18',
		'amount': 0.213
	},
	{
		'event':'Transaction Fees',
		'date': '1/19/18',
		'amount': 0.213
	},
	{
		'event':'Transaction Fees',
		'date': '4/19/18',
		'amount': 0.213
	},
	{
		'event':'Transaction Fees',
		'date': '9/14/18',
		'amount': 0.213
	},
	{
		'event':'Transaction Fees',
		'date': '10/12/18',
		'amount': 0.213
	},
	{
		'event':'Transaction Fees',
		'date': '10/19/18',
		'amount': 0.213
	},
	{
		'event':'Realization',
		'date': '4/12/19',
		'amount': 37.918536
	},
	{
		'event':'Realization',
		'date': '6/27/19',
		'amount': 77.101554
	},
	{
		'event':'Transaction Fees',
		'date': '6/27/19',
		'amount': 0.213
	},
	{
		'event':'Transaction Fees',
		'date': '7/25/19',
		'amount': 0.213
	},
	{
		'event':'Transaction Fees',
		'date': '8/8/19',
		'amount': 0.213
	},
	{
		'event':'Realization',
		'date': '9/13/19',
		'amount': 5.115411
	},
	{
		'event':'Realization',
		'date': '12/27/19',
		'amount': 26.406863
	},
	{
		'event':'Transaction Fees',
		'date': '2/13/20',
		'amount': 0.213
	},
	{
		'event':'Transaction Fees',
		'date': '5/7/20',
		'amount': 0.213
	},
	{
		'event':'Realization',
		'date': '6/30/20',
		'amount': 14.423849
	},
	{
		'event':'Transaction Fees',
		'date': '8/20/20',
		'amount': 0.213
	},
	{
		'event':'Realization',
		'date': '10/20/20',
		'amount': 16.448962
	},
	{
		'event':'Realization',
		'date': '10/26/20',
		'amount': 15.602309,
		'shares': 43.116602-TB_preIPO_shares
	},
	{
		'event':'Transaction Fees',
		'date': '10/26/20',
		'amount': 2.4992
	},
	{
		'event':'Transaction Fees',
		'date': '11/5/20',
		'amount': 0.213
	}
];