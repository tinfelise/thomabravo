function fetchPolygon(endpoint, onSuccess, onError) {
    const polygon_path = 'https://api.polygon.io';
    const polygon_key = 'A96sRRl_tmn0UPaiPC2Q2JRep2P62UJ4';
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${polygon_path}${endpoint}?apikey=${polygon_key}`,
            beforeSend: () => console.log(`Fetching ${endpoint}`),
            success: (data) => {
                if (onSuccess) onSuccess(data);
                resolve(data);
            },
            error: (error) => {
                if (onError) onError(error);
                reject(error);
            },
            timeout: 3000
        });
    });
};
  
function fetchAlphaVantage(params, onSuccess, onError) {
    const alphavantage_key = 'B67FR48WBLNMCCHH';
    $.ajax({
        url: `https://www.alphavantage.co/query?${params}&apikey=${alphavantage_key}`,
        beforeSend: () => console.log('Fetching AlphaVantage data...'),
        success: onSuccess || defaultSuccessHandler,
        error: onError || defaultErrorHandler,
        timeout: 3000
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
    async getMarketStatus(successCallback) {
        return await fetchPolygon('/v1/marketstatus/now', successCallback);
    },
    async getSnapshot(ticker, successCallback) {
      return await fetchPolygon(`/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`, successCallback);
    },
    async getLastTrade(ticker, successCallback) {
        return await fetchPolygon(`/v2/last/trade/${ticker}`, successCallback);
    },
    async getAggregates(ticker, start, end, successCallback) {
        return await fetchPolygon(`/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}`, successCallback);
    },
    async getNews(ticker, successCallback) {
        return await fetchPolygon(`/v2/reference/news?ticker=${ticker}`, successCallback);
    }
};

export const AlphaVantageAPI = {
    async getTimeSeriesData(ticker, successCallback) {
        return await fetchAlphaVantage(`function=TIME_SERIES_DAILY&symbol=${ticker}`, successCallback);
    }
};