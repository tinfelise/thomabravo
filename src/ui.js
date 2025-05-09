import { get_closing_prices, get_market_status } from '../main2.js';
import { stock } from './finance.js';

export const UI = {
    // stock data
    refresh_interval: null,
    display_updated_time (timestamp, format, market_status) {
        var html = 'As Of ';
        if (market_status == 'closed') { // can also add extended hours
            html += 'Closing ';
        };
        html += moment(timestamp, format).format('MMM.\u00A0Do\u00A0h:mma\u00A0z');
        $('#updated').html(html);
    },
    display_previous_day_of_week (date, format) {
        var days_ago = moment(date, format).diff(moment(), 'days');
        if ( isNaN(days_ago) == false ) {
            var weekday = 'yesterday';
            if (days_ago != -1) {
                weekday = moment(date, format).format('dddd');
            };
            $('#previous_weekday').html('from ' + weekday);	
        };
    },
    display_current_price (price, daily_change, percent_change) {
        let stock_class = 'up';
        let icon = 'fa-chart-line';
        if (daily_change < 0) {
            stock_class = 'down';
            icon = 'fa-chart-area';
        };
        $('body').addClass('loaded');
        $('#current_price').html( numeral(price).format('$0,0.00') );
        $('#price_changes').addClass(stock_class);
        $('#price_changes svg').remove();
        $('#price_changes').prepend('<i class="fas ' + icon + '"></i>');
        $('#compared_to_yesterday').html( numeral(daily_change).format('$0,0[.]00') );
        $('#compared_to_yesterday_perc').html('(' + numeral(percent_change).format('0.0%') + ')');
    },
    display_IPO_price (price, change, IRR) {
        let IPO_price_html = '<div id="IPO_change">';
        if (change >= 0) {
            IPO_price_html += 'Up ';
        } else {
            IPO_price_html += 'Down ';
        };
        IPO_price_html += numeral(Math.abs(change)).format('%0,0.0');
        IPO_price_html += ' From ';
        IPO_price_html += numeral(price).format('$0,0');
        IPO_price_html += ' Initial Listing (';
        IPO_price_html += numeral(IRR).format('%0,0.0');
        IPO_price_html += ' IRR)</div>';
        $('#IPO_change').remove();
        $('#stockData > div:first-of-type').append(IPO_price_html);
    },

    // thoma
    add_thoma_section (group, metrics) {
        const groupId = group.replace(/\s+/g, '_');
        let html = `<section id="${groupId}">`;
        html += this.create_ownership_section(metrics);
        html += this.create_returns_section(metrics);
        html += '</section>';
        $('#thoma').append(html);
    },
    create_ownership_section (metrics) {
        let ownershipHtml = '';
        if (metrics.shares) {
            const shares = numeral(metrics.shares).format('0,0a');
            ownershipHtml += `<h3 class='TB_shares'>${shares} <span>Shares</span></h3>`;
        }
        if (metrics.perc_stake) {
            const perc_stake = numeral(metrics.perc_stake).format('0,0[.]0%');
            ownershipHtml += `<h3 class='TB_perc_stake'>${perc_stake} <span>Stake</span></h3>`;
        }
        if (metrics.shares_value) {
            const shares_value = numeral(metrics.shares_value).format('$0.0a');
            ownershipHtml += `<h3 class='TB_shares_value'>${shares_value} <span>Value</span></h3>`;
        }
        if (metrics.perc_shares_realized) {
            const perc_shares_realized = numeral(metrics.perc_shares_realized).format('0,0[.]0%');
            ownershipHtml += `<h3 class='TB_perc_shares_realized'>${perc_shares_realized} <span>Realized</span></h3>`;
        }
        if (metrics.IRR) {
            const IRR = numeral(metrics.IRR).format('0,0[.]0%');
            ownershipHtml += `<h3 class='IRR'>${ IRR } <span>IRR</span></h3>`;
        }
        ownershipHtml = `<section class="ownership">${ownershipHtml}</section>`;
        return ownershipHtml;
    },
    create_returns_section (metrics) {
        let returnsHtml = '';
        if (metrics.realized) {
            const realized = numeral(metrics.realized).format('$0.0a');
            const realized_MoM = numeral(metrics.realized_MoM).format('0[.]00');
            returnsHtml += this.create_return('Realized', realized, realized_MoM);
        }
        if (metrics.shares_value) {
            const unrealized = numeral(metrics.shares_value).format('$0.0a');
            const unrealized_MoM = numeral(metrics.unrealized_MoM).format('0[.]00');
            returnsHtml += this.create_return('Unrealized', unrealized, unrealized_MoM);
        }
        if (metrics.total_returns) {
            const total_returns = numeral(metrics.total_returns).format('$0.0a');
            const total_MoM = numeral(metrics.total_MoM).format('0[.]00');
            returnsHtml += this.create_return('Total Returns', total_returns, total_MoM);
        }
        if (metrics.total_gain) {
            returnsHtml += this.create_total_gain_section(metrics.total_gain, metrics.MoM_targets, metrics.MoM_starting_price);
        }
        returnsHtml = `<section class="returns">${returnsHtml}</section>`;
        return returnsHtml;
    },
    create_return (type, value, MoM) {
        return `<div>
            <span>${type}</span>
            <div class='${type}'>
                <h2>${value}</h2>
                <div class='MoM'>
                    <span>${MoM}x</span> MoM
                </div>
            </div>
        </div>`;
    },
    create_total_gain_section (total_gains, MoM_targets, starting_MoM) {
        const total_gain = numeral(total_gains).format('$0.0a');
        return `<section class="total_gain">
            <h2>
                <label>${total_gain}</label>
                <span>Total Gain</span>
            </h2>
            ${MoM_targets ? this.create_MoM_slider(MoM_targets, starting_MoM) : ''}
        </section>`;
    },
    create_MoM_slider (slider_metrics, starting_MoM) {
        const starting_value = numeral(starting_MoM).format('$0.00');
        return `<form class='MoM_targets'>
            <p>Illustrative Share Price To Achieve MoM</p>
            <span><output name='target' for='MoM_range'>${slider_metrics.min}</output>x <span>MoM</span></span>
            <input type='range' name='MoM_range' min='${slider_metrics.min}' max='${slider_metrics.max}' value='${slider_metrics.min}' step='${slider_metrics.increment}'>
            <span><output name='price_required' for='MoM_range'>${starting_value}</output> <span>Target Price</span></span>
        </form>`;
    },
    display_revenue_multiples (multiples) {
        let html = '';
        for (let i in multiples) {
            const multiple = multiples[i];
            html += this.create_revenue_multiple (multiple.multiple, multiple.name);
        };
        return html;
    },
    create_revenue_multiple (multiple_value, name) {
        return `<h3 class="multiple">${numeral(multiple_value).format('0.00')}x <span>${name}</span></h3>`;
    },

    add_group_nav (money_types) {
        let navHtml = `<input type="radio" name="investor_group" id="All_group" value="All">
                        <label for="All_group">All</label>`;
        for (let type in money_types) {
            const group = money_types[type];
            const groupId = group.replace(/\s+/g, '_');
            navHtml += `<input type="radio" name="investor_group" id="${groupId}_group" value="${group}">
                        <label for="${groupId}_group">${group}</label>`;
        }
        navHtml = `<nav>${navHtml}</nav>`;
        $('#thoma nav').remove();
        $('#thoma > div').append(navHtml);

        // Hide all sections except "All" initially
        $('#thoma > section').hide();
        $('#thoma > section#All').show();

        // Add event handler for radio buttons
        $('input[name="investor_group"]').on('change', function() {
            const selectedValue = $(this).val();
            const selectedId = selectedValue.replace(/\s+/g, '_');
            $('#thoma > section').hide();
            $(`#thoma > section#${selectedId}`).show();
        });

        // Set initial state
        $('input[name="investor_group"][value="All"]').prop('checked', true);
    },
    add_disclaimer (disclaimer) {
        $('.returns_disclaimer').remove();
        var html = "<p id='returns_disclaimer' class='disclaimer'>" + disclaimer + '</p>';
        $('.total_gain').append(html);	
    },

    // comps
    create_comps_section (comps) {
        let compsHtml = ``;
        for (let comp of comps) {
            let logo = comp.logo ? `<img src="${comp.logo}" alt="${comp.name}" class="logo"> <span>Comparison</span>` : `<h3>${comp.name} <span>${comp.ticker}</span></h3>`;
            let change = comp.daily_change >= 0 ? 'up' : 'down';
            const comp_multiples = stock.calculate_revenue_multiples(comp.enterprise_value, comp.multiples);
            compsHtml += `
                <div class='comp'>
                    <div>${logo}</div>
                    <button class="close">Close</button>
                    <h2>
                        ${numeral(comp.current_price).format('$0,0.00')}
                        <span class='change ${comp.daily_change >= 0 ? 'up' : 'down'}'>
                            ${numeral(comp.daily_change).format('$0,0.00')} (${numeral(comp.daily_change_perc).format('0.0%')})
                        </span>
                    </h2>
                    <div class='metrics'>
                        <h3>${numeral(comp.market_cap).format('$0.0a')} <span>Market Cap</span></h3>
                        <h3>${numeral(comp.enterprise_value).format('$0.0a')} <span>Enterprise Value</span></h3>
                        ${this.display_revenue_multiples(comp_multiples)}
                    </div>
                </div>`;
        }
        compsHtml = `<section id='comps' class='hide'>${compsHtml}</section>`;
        $('main').append(compsHtml);
        $('main').append(this.create_comps_button(comps));
        $('#open_comps').on('click', function() {
            $('#comps').toggleClass('hide');
            $('#thoma').toggleClass('hide');
        });
        $('#comps .close').on('click', function() {
            $('#comps').toggleClass('hide');
            $('#thoma').toggleClass('hide');
        });
    },
    create_comps_button (comps) {
        let comparison = comps[0].ticker;
        if (comps.length > 1) {
            comparison = comps.length + ' Comps';
        };
        return `<button id="open_comps" class="cta">Compare ${comparison}</button>`;
    },

    // chart
    create_chart (dataset, data_labels) {
        $('#returns_over_time').remove();
        let chartHtml = '<canvas id="returns_over_time" width="400" height="400"></canvas>';
        $('main').append(chartHtml); // TODO: decide where to put this
        
        var ctx = document.getElementById('returns_over_time');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data_labels,
                datasets: [{
                    label: 'Stock Price',
                    data: get_closing_prices(dataset, data_labels),
                    borderColor: 'rgba(255, 255, 255, .75)',
                    backgroundColor: 'rgba(0,0,0,0)'
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month'
                        },
                        ticks: {
                            fontColor: 'rgba(255, 255, 255, .5)',
                            fontFamily: "'Akkurat', -apple-system, BlinkMacSystemFont, Helvetica, sans-serif",
                            fontSize: '16'
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function(value, index, values) {
                                return '$' + value;
                            },
                            fontColor: 'rgba(255, 255, 255, .5)',
                            fontSize: '16'
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                },
                tooltips: {
                    enabled: false
                },
                elements: {
                    point:{
                        radius: 0
                    }
                }
            }
        });
    },

    // news
    create_article (article, ticker) {
        var html = '<a href="' + article.article_url + '" target="_blank">';
        html +='<h3>' + article.title + '</h3>';
        html += '<span>' + article.author + ' | ' + article.publisher.name + ' | ' + moment(article.published_utc).format("MMM D, 'YY") + '</span>';
        if (article.insights) {
            for (let ins in article.insights) {
                const insight = article.insights[ins];
                if (insight.ticker == ticker && insight.sentiment != 'neutral') {
                    let sentiment = 'bear.svg';
                    if (insight.sentiment == 'positive') {
                        sentiment = 'bull.svg';
                    }
                    html += '<img src="../images/' + sentiment + '" alt="' + insight.sentiment + '">';
                    html += '<p>' + insight.sentiment_reasoning + '</p>';
                }
            }
        }
        html += '</a>';
        $('#news').append(html);
    },

    reload (clip) {
        $('body').removeClass('loaded');
        UI.reset();
        get_market_status(data.ticker);
        if (clip) {
            UI.play_sound(clip);
        }
    },
    reset () {
        // window.all_realizations = [];
        $('.ownership').remove();
        $('.returns').remove();
        // $('#MoM_targets').remove();
    },
    play_sound(clip) {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', clip);
        audioElement.play();
    },
    add_loader () {
        const loaderHtml = 
            `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <path  d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                </path>
            </svg>`;
        $('.loader').append(loaderHtml);
    },
    toggleFullScreen() {
        var doc = window.document;
        var docEl = doc.documentElement;
    
        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    
        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
            $('html').addClass('fullscreen');
            UI.auto_refresh(60);
        }
        else {
            cancelFullScreen.call(doc);
        }
    },
    auto_refresh(seconds) {
        console.log('auto_refresh', seconds);
        const time = seconds * 1000;
        UI.refresh_interval = setInterval(UI.reload, time); 
    },
    stop_refreshing() {
        clearInterval(UI.refresh_interval);
    },
    exitFullscreen() {
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            $('html').removeClass('fullscreen');
            UI.stop_refreshing();
        };
    }
}