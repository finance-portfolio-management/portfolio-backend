import express from 'express';
import { PortfolioController } from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/portfolios', PortfolioController.create);

export default router;