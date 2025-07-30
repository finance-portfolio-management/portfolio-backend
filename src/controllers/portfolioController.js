import { PortfolioService } from "../services/portfolioService.js";
import { PortfolioTransactionModel } from "../models/portfolioTransactionModel.js";
import db from '../config/db.js'

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



  
    static async buyAsset(req, res) {
        try {
        const { portfolioId } = req.params;
        const { symbol, quantity, price, dateTime } = req.body;
        const assetId = await getAssetIdBySymbol(symbol); 

        await PortfolioTransactionModel.record({
            portfolioId,
            assetId,
            type: 'buy',
            quantity,
            price,
            dateTime: dateTime || new Date()
        });

        res.status(201).json({ success: true, message: 'buy sueccessfully' });
        } catch (error) {
        res.status(400).json({ success: false, error: error.message });
        }
    }

   
    static async sellAsset(req, res) {
        try {
        const { portfolioId } = req.params;
        const { symbol, quantity, price, dateTime } = req.body;
        const assetId = await getAssetIdBySymbol(symbol);

        await PortfolioTransactionModel.record({
            portfolioId,
            assetId,
            type: 'sell',
            quantity,
            price,
            dateTime: dateTime || new Date()
        });

        res.json({ success: true, message: 'sell successfully' });
        } catch (error) {
        res.status(400).json({ success: false, error: error.message });
        }
    }

   
    static async getAssetStatus(req, res) {
        try {
        const { portfolioId } = req.params;
        const { targetDate } = req.query;
        const result = await PortfolioService.getAssetStatus(portfolioId, targetDate);
        res.json({ success: true, data: result });
        } catch (error) {
        res.status(400).json({ success: false, error: error.message });
        }
    }
    }
    async function getAssetIdBySymbol(symbol) {
    const [rows] = await db.execute('SELECT id FROM assets WHERE symbol = ?', [symbol]);
    if (rows.length === 0) throw new Error(`asset ${symbol} not exist`);
    return rows[0].id;
}
