import yahooFinance from "yahoo-finance2"; // 可以保留但不会实际调用


const PRESET_STOCKS = [  // 修正了变量名拼写错误
    { id: 1, symbol: 'WING', name: 'Wingstop Inc.', currentPrice: '368.26', growthRate: '26.86'},
    { id: 2, symbol: 'FTAI', name: 'FTAI Aviation Ltd.', currentPrice: '144.46', growthRate: '26.56' },
    { id: 3, symbol: 'PIII', name: 'P3 Health Partners Inc.', currentPrice: '7.30', growthRate: '25.86' },
    { id: 4, symbol: 'GNRC', name: 'Generac Holdings', currentPrice: '181.00', growthRate: '19.61' },
    { id: 5, symbol: 'TER', name: 'Teradyne, Inc.', currentPrice: '107.65', growthRate: '18.88' },
    { id: 6, symbol: 'NEGG', name: 'Newegg Commerce, Inc.', currentPrice: '44.97', growthRate: '-19.97' },
    { id: 7, symbol: 'CAR', name: 'Avis Budget Group, Inc.', currentPrice: '172.46', growthRate: '-15.41' },
    { id: 8, symbol: 'SLGN', name: 'Silgan Holdings Inc.', currentPrice: '47.30', growthRate: '-15.23' },
    { id: 9, symbol: 'CHKP', name: 'Check Point Software Technologies Ltd.' , currentPrice: '186.67', growthRate: '-14.50'},
    { id: 10, symbol: 'ENTG', name: 'Entegris, Inc.', currentPrice: '79.34', growthRate: '-14.46' },
];

// 修改为直接使用预设数据，无需调用API
const getStockDailyReturn = (stock) => {
    try {
        // 直接从预设数据转换数值类型
        return {
            id: stock.id,
            symbol: stock.symbol,
            name: stock.name,
            currentPrice: Number(stock.currentPrice),  // 转换为数字类型
            growthRate: Number(stock.growthRate)       // 转换为数字类型
        };
    } catch(error) {
        console.error(`处理 ${stock.symbol} 失败:`, error.message);
        return null;
    }
};

export const getMarketTopGainersLosers = () => {
    // 处理所有预设股票数据
    const stockDataList = PRESET_STOCKS.map(stock => getStockDailyReturn(stock));
    
    // 过滤无效数据并排序
    const validData = stockDataList.filter(Boolean);
    const sorted = validData.sort((a, b) => b.growthRate - a.growthRate);

    return {
        topGainers: sorted.slice(0, 5),  // 前5名涨幅股
        topLosers: sorted.slice(-5)      // 后5名跌幅股
    };
};
