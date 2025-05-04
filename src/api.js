function fetchPolygon(endpoint, onSuccess, onError) {
    const polygon_path = 'https://api.polygon.io';
    const polygon_key = 'A96sRRl_tmn0UPaiPC2Q2JRep2P62UJ4';
    $.ajax({
        url: `${polygon_path}${endpoint}?apikey=${polygon_key}`,
        beforeSend: () => console.log(`Fetching ${endpoint}`),
        success: onSuccess || defaultSuccessHandler,
        error: onError || defaultErrorHandler,
        timeout: 3000,
    });
};
  
function fetchAlphaVantage(params, onSuccess, onError) {
    const alphavantage_key = 'B67FR48WBLNMCCHH';
    $.ajax({
        url: `https://www.alphavantage.co/query?${params}&apikey=${alphavantage_key}`,
        beforeSend: () => console.log('Fetching AlphaVantage data...'),
        success: onSuccess || defaultSuccessHandler,
        error: onError || defaultErrorHandler,
    });
};

function defaultSuccessHandler(data) {
    console.log('API call succeeded.');
    console.log(data);
    return data;
};

function defaultErrorHandler() {
    console.log('API call failed.');
};

export const PolygonAPI = {
    getMarketStatus(successCallback) {
        fetchPolygon('/v1/marketstatus/now', successCallback);
    },
    getSnapshot(ticker, successCallback) {
      fetchPolygon(`/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`, successCallback);
    },
    getLastTrade(ticker, successCallback) {
      fetchPolygon(`/v2/last/trade/${ticker}`, successCallback);
    },
    getAggregates(ticker, start, end, successCallback) {
      fetchPolygon(`/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}`, successCallback);
    },
    getNews(ticker, successCallback) {
        fetchPolygon(`/v2/reference/news?ticker=${ticker}`, successCallback);
    }
};

export const AlphaVantageAPI = {
    getTimeSeriesData(ticker, successCallback) {
        fetchAlphaVantage(`function=TIME_SERIES_DAILY&symbol=${ticker}`, successCallback);
    }
};