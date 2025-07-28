import express from 'express';
import { PortfolioController } from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/portfolios', PortfolioController.create);

router.get('/portfolios', PortfolioController.getAll);

router.get('/portfolios/:portfolioId', PortfolioController.getById);

router.put('/portfolios/:portfolioId', PortfolioController.update);

export default router;