var ticker = 'INST';
// var sound = 'sail.mp3';

var MoM_slider = {
	'min': 2,
	'max': 6,
	'increment': .25
};

var options_build = [
	{
		'tranche': 1,
		'strike': 0,
		'shares': 1.648824+4.010648
	}
];

var share_count_build = {
	'Basic Shares': 126,
	'IPO Shares': 12.5,
	'Greenshoe Shares': 0
};

var revenues = {
	'2021': 386.757,
	'2022': 427.978
};
var ebitdas = {
	'2021': 119.828,
	'2022': 148.204
};
var uFCF = {
	'2021': 135.217,
	'2022': 165.684
};
var net_debt = 550.01+15-89.808;

var TB_preIPO_shares = 122.065804;
var transactions = [
	{
		'event':'Purchase',
		'date': '3/24/20',
		'amount': -1250,
		'shares': TB_preIPO_shares
	}
];