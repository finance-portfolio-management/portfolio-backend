import { PortfolioService } from "../services/portfolioService.js";

export class PortfolioController {
    static async create(req, res){
        try {
            const { name, description} = req.body;

            const portfolioId = await PortfolioService.createPortfolio(name, description);

            res.status(201).json({
                success: true,
                data: {
                    id: portfolioId,
                    name,
                    description
                }
            });
        }catch (error){
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}