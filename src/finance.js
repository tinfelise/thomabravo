import { constants } from './constants.js';
export const PE = {    
    get_current_shares (shares) {
        let total_shares = 0; // do I want to make this a global variable? needed for MOM slider
        for (let i in shares) {
            total_shares += shares[i].shares;
        };
        $('#TB_shares').html( numeral(total_shares).format('0.0a') + ' <span>Shares</span>' );
        PE.get_TB_shares_perc(total_shares, data.FDSO); 
    },
    get_TB_shares_perc (TB_shares, total_shares) {
        const perc_stake = TB_shares / (total_shares);
        const stake_html = numeral(perc_stake).format('0.0%') + ' <span>FDSO</span>';
        $('#TB_perc_stake').html(stake_html);
    
        if (TB_preIPO_shares) {
            const perc_realized = 1 - ( TB_shares/ (TB_preIPO_shares * constants.million) );
            const perc_realized_html = numeral(perc_realized).format('0.0%') + ' <span>Realized</span>';
            $('#TB_perc_shares_realized').html(perc_realized_html);
        };
    },
    get_shares_value (shares, current_price) {
        console.log('SHARES: ', shares);
        const shares_value = shares * current_price;
        return shares_value;
    }
};
