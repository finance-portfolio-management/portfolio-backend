import express from 'express';
import { PortfolioController } from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/portfolios', PortfolioController.create);

router.get('/portfolios', PortfolioController.getAll);

router.get('/portfolios/:portfolioId', PortfolioController.getById);

router.put('/portfolios/:portfolioId', PortfolioController.update);

router.delete('/portfolios/:portfolioId', PortfolioController.delete);

router.post('/portfolios/:portfolioId/buy', PortfolioController.buyAsset);

router.post('/portfolios/:portfolioId/sell', PortfolioController.sellAsset);

router.get('/portfolios/:portfolioId/status', PortfolioController.getAssetStatus);

export default router;