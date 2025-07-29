import { PortfolioAssetModel } from "../models/portfolioAssetModel.js";
import { PortfolioModel } from "../models/portfolioModel.js";
import { AssetModel } from "../models/assetModel.js";

export class PortfolioAssetService {
    static async addAsset(portfolioId, symbol, quantity, buyPrice) {
        if (quantity <= 0){
            throw new Error('The number of positions must be greater than 0');
        }
        if (buyPrice <= 0){
            throw new Error('The buy quantity must be greater than 0');
        }
        if (!symbol.trim()){
            throw new Error('asset symbol does not exist');
        }
        const portfolio = await PortfolioModel.findById(portfolioId);
        if(!portfolio){
            throw new Error(`ID is ${portfolioId}$ combination does not exist`);
        }
        const asset = await AssetModel.getBySymbol(symbol);
        if (!asset){
            throw new Error(`asset symbol=${symbol}$ not exist, pleast ensure asset already created`);
        }

        await PortfolioAssetModel.add(portfolioId, asset.id, quantity, buyPrice);

        return {
            portfolio: {
                id: portfolioId,
                name: portfolio.name
            },
            asset: {
                id: asset.id,
                symbol: asset.symbol,
                name: asset.name
            },
            holding: {
                quantity,
                buyPrice
            }
        };
    }
}