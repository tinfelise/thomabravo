var ticker = 'SAIL';
var sound = 'sail.mp3';

var options_build = [
	{
		'tranche': 1,
		'strike': 0,
		'shares': 1.316195
	},
	{
		'tranche': 2,
		'strike': 6.45,
		'shares': 2.937716
	},
	{
		'tranche': 3,
		'strike': 0.0517,
		'shares': 0.740009
	}
];

var share_count_build = {
	'Basic Shares': 87.788512,
	'Pref-Shares': 0,
	'IPO Shares': 0,
	'Greenshoe Shares': 0
};

var revenues = {
	'2018': 241.60,
	'2019': 295.95
};
var net_debt = 9.669-83.315-0.121;

var TB_preIPO_shares = 56.723354+0.00024;
var transactions = [
	{
		'event':'Purchase',
		'date': '9/8/14',
		'amount': -200,
		'shares': TB_preIPO_shares
	},
	{
		'event':'Transaction Fees',
		'date': '11/12/14',
		'amount': 0.030899
	},
	{
		'event':'Transaction Fees',
		'date': '1/15/15',
		'amount': 0.125
	},
	{
		'event':'Transaction Fees',
		'date': '4/1/15',
		'amount': 0.1875
	},
	{
		'event':'Transaction Fees',
		'date': '7/1/15',
		'amount': 0.1875
	},
	{
		'event':'Transaction Fees',
		'date': '10/1/15',
		'amount': 0.1875
	},
	{
		'event':'Transaction Fees',
		'date': '12/16/15',
		'amount': 0.1875
	},
	{
		'event':'Transaction Fees',
		'date': '3/31/16',
		'amount': 0.25
	},
	{
		'event':'Transaction Fees',
		'date': '6/17/16',
		'amount': 0.25
	},
	{
		'event':'Transaction Fees',
		'date': '9/29/16',
		'amount': 0.25
	},
	{
		'event':'Transaction Fees',
		'date': '12/30/16',
		'amount': 0.25
	},
	{
		'event':'Transaction Fees',
		'date': '4/11/17',
		'amount': 0.3125
	},
	{
		'event':'Realization',
		'date': '6/29/17',
		'amount': 44.90071809,
		'shares': 0
	},
	{
		'event':'Transaction Fees',
		'date': '7/6/17',
		'amount': 0.3125
	},
	{
		'event':'Transaction Fees',
		'date': '10/6/17',
		'amount': 0.3125
	},
	{
		'event':'Sold @ IPO',
		'date': '11/22/17',
		'amount': 72.540013,
		'shares':  -6.5
	},
	{
		'event':'Transaction Fees',
		'date': '1/9/18',
		'amount': 159647/1000000
	},
	{
		'event':'Transaction Fees',
		'date': '1/17/18',
		'amount': 9289/1000000
	},
	{
		'event':'Transaction Fees',
		'date': '3/14/18',
		'amount': 12667/1000000
	},
	{
		'event':'Transaction Fees',
		'date': '3/26/18',
		'amount': 6333/1000000
	},
	{
		'event':'Transaction Fees',
		'date': '4/27/18',
		'amount': 6333/1000000
	},
	{
		'event':'Transaction Fees',
		'date': '5/15/18',
		'amount': 6333/1000000
	},
	{
		'event':'First Follow-On Realization',
		'date': '5/24/18',
		'amount': 444.65463,
		'shares':  -20.4792
	},
	{
		'event':'GP Distribution',
		'date': '6/8/18',
		'amount': 91.391666,
		'shares': -((TB_preIPO_shares - 6.5 - 20.4792) - (16.427743 + 8.81734 + 0.38356))
	},
	{
		'event':'Transaction Fees',
		'date': '7/13/18',
		'amount': 0.006333
	},
	{
		'event':'Transaction Fees',
		'date': '7/13/18',
		'amount': 0.007472
	},
	{
		'event':'Second Follow-On Realization',
		'date': '8/16/18',
		'amount': 545.1005516875,
		'shares': -19.809501
	},
	{
		'event':'Block Trade',
		'date': '12/3/18',
		'amount': 4.862812*25.5,
		'shares': -4.862812
	},
	{
		'event':'GP Distribution',
		'date': '12/3/18',
		'amount': 0.83696*25.5,
		'shares': -0.83696
	},
	{
		'event':'Block Trade',
		'date': '12/12/18',
		'amount': 0.11961*25.5,
		'shares': -0.11961
	}
];