import { PortfolioModel } from "../models/portfolioModel.js";

export class PortfolioService {

    static async createPortfolio(name, description = ''){
        if (!name || name.trim() === ''){
            throw new Error('the combination cannot be empty');
        }
        if (name.length > 100){
            throw new Error('the combination name cannot exceed 100');
        }

        const portfolioId = await PortfolioModel.create(name, description);

        return portfolioId;
    }

    static async getAllPortfolios() {
        const portfolios = await PortfolioModel.findAll();

        if (portfolios.length === 0){
            return [];
        }
        return portfolios;
    }

    static async getPortfolioById(portfolioId){
        const portfolio = await PortfolioModel.findById(portfolioId);

        if(!portfolio){
            throw new Error('ID is${portfolioId} combination does not exist ');
        }

        return portfolio;
    }


    static async updatePortfolio(portfolioId, { name, description }) {
     
        const portfolio = await PortfolioModel.findById(portfolioId);
        if (!portfolio) {
          throw new Error(`ID is${portfolioId} does not exist`);
        }
    

        if (!name.trim()) {
          throw new Error('combination name can not be empty');
        }
        if (name.length > 100) {
          throw new Error('combination name can not exceed 100');
        }
    

        await PortfolioModel.update(portfolioId, { name, description });
        return true;
      }
}