import { PortfolioAssetService } from "../services/portfolioAssetService.js";

export class PortfolioAssetController {
    static async add(req, res) {
        try {
            const { portfolioId } = req.params;
            const { symbol, quantity, buyPrice} = req.body;

            const result = await PortfolioAssetService.addAsset(
                portfolioId,
                symbol,
                Number(quantity),
                Number(buyPrice),
                assetExtra
            );

            res.status(201).json({
                success: true,
                message: `asset ${symbol}$ already add to combination ${portfolioId}$`,
                data: result
            });
        }catch (error){
            const statusCode = error.message.includes('not exist') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }
}