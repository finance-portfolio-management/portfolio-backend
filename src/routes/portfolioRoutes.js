import express from 'express';

import { AssetController } from '../controllers/portfolioController.js';

const router = express.Router();

// 买入资产
router.post('/buy', AssetController.buy);

// 卖出资产
router.post('/sell', AssetController.sell);

// 查询持仓
router.get('/holdings', AssetController.getHoldings);

export default router;