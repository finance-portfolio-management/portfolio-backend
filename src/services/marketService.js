import yahooFinance from "yahoo-finance2";


const PRRSET_STOCKS = [
    {id:1,symbol: 'AAPL', name:'Apple Inc.'},
    {id:2,symbol: 'MSFT', name:'Microsoft Corporation'},
    {id:3,symbol: 'GOOGL', name:'Alphabet Inc.'},
    {id:4,symbol: 'AMZN', name:'Amazon.com Inc.'},
    {id:5,symbol: 'TSLA', name:'Tesla Inc.'},
    {id:6,symbol: 'NVDA', name:'NVIDIA Corporation'},
    {id:7,symbol: '600519.SS', name:'guizhou Moutai'},
    {id:8,symbol: '00700.HK', name:'Tecent Holdings'},
    {id:9,symbol: 'NESTLE', name:'Nestle SA'},
    {id:10,symbol: 'SHEL', name:'Shell plc'},
    {id:11,symbol: 'NOVN', name:'Novartis AG'},
    {id:12,symbol: 'SAP', name:'SAP SE'},
    {id:13,symbol: 'UL', name:'Unilever PLC'},
   
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