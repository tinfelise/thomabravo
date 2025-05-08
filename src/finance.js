import { constants } from './constants.js';
const finance = new Finance();
export const stock = {
    calculate_revenue_multiples (enterprise_value, all_multiples) {
        const multiples = [];
        for (let multiple in all_multiples) {
            for (let year in all_multiples[multiple].years) {
                const amount = all_multiples[multiple].years[year];
                const multiple_value = enterprise_value / (amount * constants.million);
                const type = all_multiples[multiple].type;
                const name = `${year} ${type}`;
                multiples.push({
                    multiple: multiple_value,
                    name: name
                });
            };
        };
        return multiples;
    }
};
export const PE = {    
    get_ownership_metrics (current_price, data, group) {
        const ownership = {};
        if (group) {
            ownership.group = group;
        } else {
            ownership.group = 'All';
        }
        const transactions = this.filter_transactions_by_group(data.transactions, group);
        const { realized, investment, current_shares } = this.sum_transactions(transactions);
        ownership.shares = current_shares;
        ownership.realized = realized;
        ownership.investment = investment;
        ownership.realized_MoM = this.calc_MoM(ownership.realized, ownership.investment);
        ownership.shares_value = this.get_shares_value(ownership.shares, current_price); // also unrealized gains
        ownership.unrealized_MoM = this.calc_MoM(ownership.shares_value, ownership.investment);
        ownership.perc_stake = this.get_perc_stake(ownership.shares, data.FDSO);
        // ownership.perc_shares_realized = this.get_perc_shares_realized(ownership.shares, data.FDSO);
        const transactions_and_target = this.add_unrealized(ownership.shares_value, transactions);
        const { total_returns, total_gain } = this.sum_returns(ownership.realized, ownership.shares_value, ownership.investment);
        ownership.total_returns = total_returns;
        ownership.total_MoM = this.calc_MoM(ownership.total_returns, ownership.investment);
        ownership.total_gain = total_gain;
        ownership.IRR = this.get_IRR(transactions_and_target);
        if (data.MoM_slider) {
            ownership.MoM_targets = data.MoM_slider;
            ownership.MoM_starting_price = this.calc_target_price(data.MoM_slider.min, ownership.investment, ownership.realized, ownership.shares);
        }
        return ownership;
    },
    filter_transactions_by_group(transactions, group) {
        if (group) {
            return transactions.filter(transaction => transaction.group === group);
        } else {
            return transactions;
        }
    },
    sum_transactions (transactions) {
        let realized = 0, investment = 0, current_shares = 0;
        for (let i in transactions) {
            const value = transactions[i].amount;
            if (value > 0) {
                realized += value * constants.million;
            } else {
                investment += -value * constants.million;
            }
    
            const shares = transactions[i].shares;
            if (shares) {
                current_shares += shares * constants.million;
            }
        }
        return { realized, investment, current_shares };
    },
    get_shares_value (shares, current_price) {
        const shares_value = shares * current_price;
        return shares_value;
    },
    get_perc_stake (shares, total_shares) {
        const perc_stake = shares / (total_shares * constants.million);
        return perc_stake;
    },
    add_unrealized(share_value, transactions) {
        let all_transactions = [...transactions];  // Create new array with existing transactions
        const IPO_mark = {
            'event': 'IPO Mark',
            'date': moment().format('MM/DD/YY'),
            'amount': (share_value / constants.million)
        };
        all_transactions.push(IPO_mark);  // Add IPO mark to the array
        constants.order_events(all_transactions, 'MM/DD/YY');
        return all_transactions;
    },
    add_new_realizations (array) {
        for (obj in array) {
            all_transactions.push(array[obj]);
        };
        constants.order_events(all_transactions, 'MM/DD/YY');
    },
    sum_returns (realized, unrealized, investment) {
        const total_returns = realized + unrealized;
        const total_gain = total_returns - investment;
        return { total_returns, total_gain };
    },
    calc_MoM (gain, investment) {
        return gain / investment;
    },
    calc_target_price (target_MoM, investment, realized, current_shares) {
        const equity = target_MoM * investment;
        const trading_value = equity - realized;
        const target_price = trading_value / current_shares;
        return target_price;
    },
    get_target_price (target_MoM, investment, realized, current_shares) {
        const target_price = this.calc_target_price(target_MoM, investment, realized, current_shares);
        return target_price;
    },
    get_IRR (realizations) {
        var amounts = [];
        var dates = [];
        for (let i in realizations) {
            amounts[i] = realizations[i].amount * constants.million;
            dates[i] = constants.return_date('MM/DD/YY',realizations[i].date);
        };
        var XIRR = finance.XIRR(amounts, dates) / 100;
        return XIRR;
    },
    get_current_shares (shares) {
        let total_shares = 0; // do I want to make this a global variable? needed for MOM slider
        for (let i in shares) {
            total_shares += shares[i].shares;
        };
        $('.TB_shares').html( numeral(total_shares).format('0.0a') + ' <span>Shares</span>' );
        PE.get_TB_shares_perc(total_shares, data.FDSO); 
    },
    get_TB_shares_perc (TB_shares, total_shares) {
        const perc_stake = TB_shares / (total_shares);
        const stake_html = numeral(perc_stake).format('0.0%') + ' <span>FDSO</span>';
        $('.TB_perc_stake').html(stake_html);
    
        if (TB_preIPO_shares) {
            const perc_realized = 1 - ( TB_shares/ (TB_preIPO_shares * constants.million) );
            const perc_realized_html = numeral(perc_realized).format('0.0%') + ' <span>Realized</span>';
            $('.TB_perc_shares_realized').html(perc_realized_html);
        };
    }
};
