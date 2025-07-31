import yahooFinance from "yahoo-finance2";



const PRRSET_STOCKS = [
    { id: 1, symbol: 'AAPL', name: 'Apple Inc.' },
    { id: 2, symbol: 'MSFT', name: 'Microsoft Corporation' },
    { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { id: 4, symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { id: 5, symbol: 'TSLA', name: 'Tesla Inc.' },
    { id: 6, symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { id: 7, symbol: 'META', name: 'Meta Platforms Inc.' },
    { id: 8, symbol: 'NFLX', name: 'Netflix Inc.' },
    { id: 9, symbol: 'AMD', name: 'Advanced Micro Devices' },
    { id: 10, symbol: 'IBM', name: 'International Business Machines Corp.' },
    { id: 11, symbol: 'COST', name: 'Costco Wholesale Corp.' },
    { id: 12, symbol: 'WMT', name: 'Walmart Inc.' },
    { id: 13, symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { id: 14, symbol: 'BAC', name: 'Bank of America Corp.' },
    { id: 15, symbol: 'XOM', name: 'Exxon Mobil Corp.' },
    { id: 16, symbol: 'CVX', name: 'Chevron Corp.' },
    { id: 17, symbol: 'UNH', name: 'UnitedHealth Group Inc.' },
    { id: 18, symbol: 'LLY', name: 'Eli Lilly and Co.' },
    { id: 19, symbol: 'ABT', name: 'Abbott Laboratories' },
    { id: 20, symbol: 'HD', name: 'Home Depot Inc.' },
    { id: 21, symbol: 'INTC', name: 'Intel Corporation' },
    { id: 22, symbol: 'DIS', name: 'The Walt Disney Company' },
    { id: 23, symbol: 'T', name: 'AT&T Inc.' },
    { id: 24, symbol: 'PFE', name: 'Pfizer Inc.'},
    { id: 25, symbol: 'GE', name: 'General Electric Company' },
    { id: 26, symbol: 'F', name: 'Ford Motor Company'},
    { id: 27, symbol: 'GM', name: 'General Motors Company' },
    { id: 28, symbol: 'MCD', name: 'McDonalds Corporation' },
    { id: 29, symbol: 'KO', name: 'The Coca-Cola Company' },
    { id: 30, symbol: 'HPQ', name: 'HP Inc.' }
  ];

const  getStockDailyReturn = async (stock) => {
    try {
        const {symbol, name} = stock;
        const quote = await yahooFinance.quote(symbol);
        if (!quote?.regularMarketPrice || !quote?.regularMarketOpen)
            return null;
        const growthRate = ((quote.regularMarketPrice-quote.regularMarketOpen)/ quote.regularMarketOpen) * 100;
        return {
            id: stock.id,
            symbol,
            name,
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