import express from 'express';
import { PortfolioAssetController } from '../controllers/portfolioAssetController.js';

const router = express.Router();


router.post('/portfolios/:portfolioId/assets', PortfolioAssetController.add);

export default router;