var ticker = 'INST';
// var sound = 'sail.mp3';

var IPO = {
	'price': 20,
	'date': '7/21/21'
};

var MoM_slider = {
	'min': 2,
	'max': 6,
	'increment': 0.25
};

var options_build = [
	{
		'tranche': 1,
		'strike': 0,
		'shares': 4.723
	}
];

var share_count_build = {
	'Basic Shares': 140.740569-12.5,
	'IPO Shares': 12.5,
	'Greenshoe Shares': 0
};

var revenue_multiples = [
	{
		'type': 'Revenues',
		'years': {
			'2022': 458.926,
			'2023': 509.303
		}
	},
	{
		'type': 'EBITDA',
		'years': {
			'2022': 164.534,
			'2023': 188.142
		}
	},
	{
		'type': 'uFCF',
		'years': {
			'2022': 179.214,
			'2023': 214.854
		}
	}
];

var net_debt = 500-164.928;

var TB_preIPO_shares = 122.065804;
var transactions = [
	{
		'event':'Purchase',
		'date': '3/24/20',
		'amount': -1250,
		'shares': TB_preIPO_shares
	}
];