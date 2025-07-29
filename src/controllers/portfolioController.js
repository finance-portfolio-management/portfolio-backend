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

    static async getAll(req, res) {
        try{
            const portfolios = await PortfolioService.getAllPortfolios();

            res.status(200).json({
                success: true,
                count: portfolios.length,
                data: portfolios
            });
        }catch (error){
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getById(req, res){
        try{
            const { portfolioId} = req.params;

            const portfolio = await PortfolioService.getPortfolioById(portfolioId);

            res.status(200).json({
                success:true,
                data:portfolio
            });
        } catch(error){
            if (error.message.includes('not exist')){
                return res.status(404).json({
                    success: false,
                    error:error.message
                });
            }
            res.status(500).json({
                success:false,
                error: error.message
            });
        }
    }

    static async update(req, res) {
        try {
          const { portfolioId } = req.params;
          const { name, description } = req.body;
    

          await PortfolioService.updatePortfolio(portfolioId, { name, description });

          const updatedPortfolio = await PortfolioService.getPortfolioById(portfolioId);
          res.json({
            success: true,
            message: 'combination update success',
            data: updatedPortfolio
          });
        } catch (error) {
          if (error.message.includes('not exist')) {
            return res.status(404).json({ success: false, error: error.message });
          }
          res.status(400).json({ success: false, error: error.message });
        }
      }

    static async delete(req, res){
        try{
            const { portfolioId } = req.params;
            await PortfolioService.deletePortfolio(portfolioId);

            res.json({
                success: true,
                message: 'ID is ${portfolioId}$ combination has beem deleted'
            });
        } catch (error){
            if (error.message.includes('not exist')){
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}