import yahooFinance from "yahoo-finance2";


const PRRSET_STOCKS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA',
    'NVDA', 'JPM', 'NFLX', 'DIS', '600519.SS', '000858.SZ',
    '601318.SS', '000333.SZ', '00700.HK', '00001.HK'
];

const  getStockDailyReturn = async (symbol) => {
    try {
        const quote = await yahooFinance.quote(symbol);
        if (!quote?.regularMarketPrice || !quote?.regularMarketOpen)
            return null;
        const growthRate = ((quote.regularMarketPrice-quote.regularMarketOpen)/ quote.regularMarketOpen) * 100;
        return {
            symbol,
            currentPrice: quote.regularMarketPrice.toFixed(2),
            growthRate: growthRate.toFixed(2)
        };
    } catch(error) {
        console.error('pass ${symbol}:', error.message);
        return null;
    }
};

export const getMarketTopGainersLosers = async () => {

    const stockDataList = await Promise.all(
        PRRSET_STOCKS.map(symbol => getStockDailyReturn(symbol)));

        const validData = stockDataList.filter(Boolean);
        const sorted = validData.sort((a,b) => b.growthRate - a.growthRate);

        return {
            topGainers: sorted.slice(0,5),
            topLosers: sorted.slice(-5)
        };

}