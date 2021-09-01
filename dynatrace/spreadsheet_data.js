var ticker = 'DT';
var sound = 'For the love of money.m4a';
var disclaimer = 'All return figures include Compuware sale proceeds.'

var IPO = {
	'price': 16,
	'date': '8/1/19'
};

var MoM_slider = {
	'min': 10,
	'max': 17,
	'increment': .5
};

var options_build = [
	{
		'tranche': 1,
		'strike': 21.75,
		'shares': 8.001
	},
	{
		'tranche': 2,
		'strike': 0,
		'shares': 0.468
	},
	{
		'tranche': 3,
		'strike': 0,
		'shares': 4.824
	}
];

var basic_shares_build = {
	'Common':0,
	'RSAs': 0
};

var share_count_build = {
	'Basic Shares': 284.286347,
	'IPO Shares': 0,
	'Greenshoe Shares': 0
};

var revenues = {
	'2021': 859.2,
	'2022': 1088.5
};
var ARRs = {
	'2021': 944.8,
	'2022': 1196.3
};
var uFCF = {
	'2021': 293.1,
	'2022': 317
};
var net_debt = 371.125-387.218;

var TB_preIPO_shares = 194.425163;
var transactions = [
	{
		'event':'Purchase',
		'date': '8/22/13',
		'amount': -135,
		'shares': TB_preIPO_shares
	},
	{
		'event':'Transaction Fees',
		'date': '8/22/13',
		'amount': 4
	},
	{
		'event':'Transaction Fees',
		'date': '11/22/13',
		'amount': 0.5
	},
	{
		'event':'Transaction Fees',
		'date': '2/21/14',
		'amount': 0.25
	},
	{
		'event':'Transaction Fees',
		'date': '5/29/14',
		'amount': 0.25
	},
	{
		'event':'Transaction Fees',
		'date': '7/14/14',
		'amount': 0.25
	},
	{
		'event':'Transaction Fees',
		'date': '11/26/14',
		'amount': 0.25
	},
	{
		'event':'Purchase',
		'date': '12/15/14',
		'amount': -562,
		'shares': 0
	},
	{
		'event':'Transaction Fees',
		'date': '12/15/14',
		'amount': 22
	},
	{
		'event':'Transaction Fees',
		'date': '1/15/15',
		'amount': 2.08
	},
	{
		'event':'Transaction Fees',
		'date': '3/31/15',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '7/7/15',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '10/7/15',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '12/31/15',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '6/17/16',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '6/28/16',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '10/27/16',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '1/4/17',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '3/28/17',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '6/29/17',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '9/29/17',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '12/29/17',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '3/27/18',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '6/28/18',
		'amount': 1.77 
	},
	{
		'event':'Transaction Fees',
		'date': '10/4/18',
		'amount': 0.57 
	},
	{
		'event':'Transaction Fees',
		'date': '10/10/18',
		'amount': 1.06 
	},
	{
		'event':'Transaction Fees',
		'date': '11/27/18',
		'amount': 0.14
	},
	{
		'event':'Transaction Fees',
		'date': '1/4/19',
		'amount': 1.06 
	},
	{
		'event':'Transaction Fees',
		'date': '1/10/19',
		'amount': 0.57
	},
	{
		'event':'Transaction Fees',
		'date': '2/14/19',
		'amount': 0.14
	},
	{
		'event':'Transaction Fees',
		'date': '4/9/19',
		'amount': 1.06
	},
	{
		'event':'Transaction Fees',
		'date': '4/12/19',
		'amount': 0.57
	},
	{
		'event':'Transaction Fees',
		'date': '4/18/19',
		'amount': 0.14
	},
	{
		'event':'Transaction Fees',
		'date': '6/28/19',
		'amount': 0.35
	},
	{
		'event':'Transaction Fees',
		'date': '7/1/19',
		'amount': 0.57
	},
	{
		'event':'Realization',
		'date': '12/10/19',
		'amount': 561.66,
		'shares': -23.3588988
	},
	{
		'event':'Realization',
		'date': '12/18/19',
		'amount': 87.43,
		'shares': -3.63606692542934
	},
	{
		'event':'Realization',
		'date': '2/25/20',
		'amount': 714.64,
		'shares': -21.270072
	},
	{
		'event':'Transaction Fees',
		'date': '3/30/20',
		'amount': 0.06 
	},
	{
		'event':'Transaction Fees',
		'date': '4/16/20',
		'amount': 0.02 
	},
	{
		'event':'Realization',
		'date': '6/1/20',
		'amount': 724.67592155
	},
	{
		'event':'Realization',
		'date': '6/5/20',
		'amount': 29.668891*35*(1-(1.9/100)),
		'shares': -29.668891
	},
	{
		'event':'Realization - Future',
		'date': '10/1/20',
		'amount': 2.60901324
	},
	{
		'event':'Realization',
		'date': '7/10/20',
		'amount': 45.96878129
	},
	{
		'event':'Realization',
		'date': '8/7/20',
		'amount': 21.412966*40.9,
		'shares': -21.412966
	},
	{
		'event':'Realization',
		'date': '12/9/20',
		'amount': 10.78*40.15,
		'shares': -10.78
	}
];