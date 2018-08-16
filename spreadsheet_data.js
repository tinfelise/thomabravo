var ticker = 'SAIL';
var sound = 'sail.mp3';

var options_build = [
	{
		'tranche': 1,
		'strike': 0,
		'shares': 1.245609,
	},
	{
		'tranche': 2,
		'strike': 6.11,
		'shares': 3.102936,
	},
	{
		'tranche': 3,
		'strike': 0.0517,
		'shares': 0.994173,
	}
];

var share_count_build = {
	'Basic Shares': 87.638578,
	'Pref-Shares': 0,
	'IPO Shares': 0,
	'Greenshoe Shares': 0
};

var postIPO_realizations = [
	{
		'event':'Sold @ IPO',
		'date': '11/22/17',
		'shares':  6.5,
		'amount': 72.540013
	},
	{
		'event':'First Follow-On Realization',
		'date': '5/24/18',
		'shares':  20.4792,
		'amount': 444.65463
	},
	{
		'event':'GP Distribution',
		'date': '6/8/18',
		'shares': (56.817016 - 6.5 - 20.4792) - (16.427743 + 8.81734 + 0.38356),
		'amount': 91.391666
	},
	{
		'event':'Second Follow-On Realization',
		'date': '8/16/18',
		'shares': 19.809501000,
		'amount': 545.1005516875
	}
];

var TB_preIPO_shares = 56.723354;

var revenues = {
	'2018': 234.82,
	'2019': 287.7
};
var net_debt = -71.929;

var purchase = {
	'event':'Purchase',
	'date': '9/8/14',
	'amount': -200
}
var preIPO_realizations = [
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
		'amount': 44.90071809
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
	// {
	// 	'event':'First Follow-On Realization',
	// 	'date': '5/24/18',
	// 	'amount': 444.65463
	// },
	// {
	// 	'event':'GP Distribution',
	// 	'date': '6/8/18',
	// 	'amount': 91.391666
	// },
	{
		'event':'Transaction Fees',
		'date': '7/13/18',
		'amount': 0.006333
	},
	{
		'event':'Transaction Fees',
		'date': '7/13/18',
		'amount': 0.007472
	}
];