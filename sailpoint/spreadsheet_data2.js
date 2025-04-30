const data = {
	"ticker": 'SAIL',
	"name": 'SailPoint',
	"sound": 'sail.mp3',
	"logo": 'sailpoint-logo.png',
	"FDSO": 573.93698,
	"net_debt": 300,
	"current_shares": [
		{
			'type': 'Old Money',
			'shares': 291.3287510
		},
		{
			'type': 'New Money',
			'shares': 24.8707570
		}
	],
	"IPO": {
		"price": 23,
		"date": '2/13/25'
	},
	"MoM_slider": {
		'min': 2,
		'max': 6,
		'increment': 0.25
	},
	"multiples": [
		{
			'type': 'Revenues',
			'years': {
				'2026': 1029,
				'2027': 1236
			}
		},
		{
			'type': 'ARR',
			'years': {
				'2026': 1075,
				'2027': 1315 
			}
		}
	],
	"transactions": [
		{
		  "event": "Purchase",
		  "money": "Old",
		  "date": "8/16/22",
		  "amount": -4035.07
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "8/16/22",
		  "amount": 118.58
		},
		{
		  "event": "Purchase",
		  "money": "Old",
		  "date": "8/23/22",
		  "amount": 100.04
		},
		{
		  "event": "Realization",
		  "money": "Old",
		  "date": "8/23/22",
		  "amount": 0.11
		},
		{
		  "event": "Purchase",
		  "money": "Old",
		  "date": "8/26/22",
		  "amount": 15.03
		},
		{
		  "event": "Realization",
		  "money": "Old",
		  "date": "8/26/22",
		  "amount": 0.02
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "11/10/22",
		  "amount": 3.71
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "11/17/22",
		  "amount": -0.01
		},
		{
		  "event": "Purchase",
		  "money": "Old",
		  "date": "12/19/22",
		  "amount": 0.43
		},
		{
		  "event": "Realization",
		  "money": "Old",
		  "date": "12/19/22",
		  "amount": 0
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "12/30/22",
		  "amount": 2.47
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "3/28/23",
		  "amount": 2.47
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "6/22/23",
		  "amount": 2.47
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "9/29/23",
		  "amount": 1.24
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "12/28/23",
		  "amount": 1.24
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "3/29/24",
		  "amount": 1.24
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "7/9/24",
		  "amount": 1.24
		},
		{
		  "event": "Transaction Fees",
		  "money": "Old",
		  "date": "9/26/24",
		  "amount": 1.24
		},
		{
		  "event": "Purchase",
		  "money": "New",
		  "date": "12/23/24",
		  "amount": -599.93
		},
		{
		  "event": "Transaction Fees",
		  "money": "New",
		  "date": "12/24/24",
		  "amount": 1.24
		},
		{
		  "event": "Purchase",
		  "money": "New",
		  "date": "1/21/25",
		  "amount": 203.21
		},
		{
		  "event": "@ IPO",
		  "money": "Old",
		  "date": "2/14/25",
		  "amount": 0,
		  "shares": 292.8
		},
		{
		  "event": "@ IPO",
		  "money": "New",
		  "date": "2/14/25",
		  "amount": 0,
		  "shares": 25.0
		},
		{
		  "event": "Realization",
		  "money": "Old",
		  "date": "2/14/25",
		  "amount": 33.25,
		  "shares": 1.5
		},
		{
		  "event": "Realization",
		  "money": "New",
		  "date": "2/14/25",
		  "amount": 2.84,
		  "shares": 0.1
		}
	],
	"comps": [
		{
			'name': 'Cyberark',
			'ticker': 'CYBR',
			'FDSO': 52.1484258739284,
			'net_debt': -676.121,
			'multiples': [
				{
					'type': 'Revenues',
					'years': {
						'2025': 1317.99544499625,
						'2026': 1581.76263877117
					}
				},
				{
					'type': 'ARR',
					'years': {
						'2025': 1429.9686520153,
						'2026': 1703.99772633063
					}
				}
			]
		}
	]
}


const TB_preIPO_shares = 122.065804;
const transactions = [
	{
	  "event": "Purchase",
	  "money": "Old",
	  "date": "8/16/22",
	  "amount": -4035.07
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "8/16/22",
	  "amount": 118.58
	},
	{
	  "event": "Purchase",
	  "money": "Old",
	  "date": "8/23/22",
	  "amount": 100.04
	},
	{
	  "event": "Realization",
	  "money": "Old",
	  "date": "8/23/22",
	  "amount": 0.11
	},
	{
	  "event": "Purchase",
	  "money": "Old",
	  "date": "8/26/22",
	  "amount": 15.03
	},
	{
	  "event": "Realization",
	  "money": "Old",
	  "date": "8/26/22",
	  "amount": 0.02
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "11/10/22",
	  "amount": 3.71
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "11/17/22",
	  "amount": -0.01
	},
	{
	  "event": "Purchase",
	  "money": "Old",
	  "date": "12/19/22",
	  "amount": 0.43
	},
	{
	  "event": "Realization",
	  "money": "Old",
	  "date": "12/19/22",
	  "amount": 0
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "12/30/22",
	  "amount": 2.47
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "3/28/23",
	  "amount": 2.47
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "6/22/23",
	  "amount": 2.47
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "9/29/23",
	  "amount": 1.24
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "12/28/23",
	  "amount": 1.24
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "3/29/24",
	  "amount": 1.24
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "7/9/24",
	  "amount": 1.24
	},
	{
	  "event": "Transaction Fees",
	  "money": "Old",
	  "date": "9/26/24",
	  "amount": 1.24
	},
	{
	  "event": "Purchase",
	  "money": "New",
	  "date": "12/23/24",
	  "amount": -599.93
	},
	{
	  "event": "Transaction Fees",
	  "money": "New",
	  "date": "12/24/24",
	  "amount": 1.24
	},
	{
	  "event": "Purchase",
	  "money": "New",
	  "date": "1/21/25",
	  "amount": 203.21
	},
	{
	  "event": "@ IPO",
	  "money": "Old",
	  "date": "2/14/25",
	  "amount": 0,
	  "shares": 292.8
	},
	{
	  "event": "@ IPO",
	  "money": "New",
	  "date": "2/14/25",
	  "amount": 0,
	  "shares": 25.0
	},
	{
	  "event": "Realization",
	  "money": "Old",
	  "date": "2/14/25",
	  "amount": 33.25,
	  "shares": 1.5
	},
	{
	  "event": "Realization",
	  "money": "New",
	  "date": "2/14/25",
	  "amount": 2.84,
	  "shares": 0.1
	}
];