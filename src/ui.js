import { get_closing_prices, get_market_status } from '../main2.js';

export const UI = {
    // chart
    create_chart (dataset, data_labels) {
        $('#returns_over_time').remove();
        var html = '<canvas id="returns_over_time" width="400" height="400"></canvas>'
        $('#total_gain').append(html);
        
        var ctx = $('#returns_over_time');
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

    reset () {
        window.all_realizations = [];
        $('#MoM_targets').remove();
    },
    reload (clip) {
        $('body').removeClass('loaded');
        this.reset();
        get_market_status(data.ticker);
        if (clip) {
            this.play_sound(clip);
        }
    },
    play_sound(clip) {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', clip);
        audioElement.play();
    }
};