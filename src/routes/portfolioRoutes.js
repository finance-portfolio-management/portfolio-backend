import express from 'express';

import { AssetController } from '../controllers/portfolioController.js';

const router = express.Router();

// 买入资产
/**
 * @swagger
 * tags:
 *   name: Assets Transactions
 *   description: Assets Buying and Selling API
 */

/**
 * @swagger
 * /api/buy:
 *   post:
 *     summary: Execute buy transaction
 *     description: Purchases specified quantity of an asset using automatic market price lookup
 *     tags: [Assets Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - name
 *               - quantity
 *               - tradeDate
 *             properties:
 *               symbol:
 *                 type: string
 *                 example: "AAPL"
 *                 description: Asset ticker symbol
 *               name:
 *                 type: string
 *                 example: "Apple Inc."
 *                 description: Full asset name  
 *               quantity:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 55
 *                 description: Quantity to purchase (must be positive)
 *               tradeDate:
 *                 type: string
 *                 format: date
 *                 pattern: '^\d{4}-\d{2}-\d{2}$'
 *                 example: "2024-07-30"
 *                 description: Trade execution date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Buy order executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transactionId:
 *                   type: string
 *                   format: uuid
 *                   example: "5f4dcc3b-5aa6-41e7-b7a8-7078f8acb429"
 *                 message:
 *                   type: string
 *                   example: "Purchased 55 shares of AAPL"
 *       400:
 *         description: Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/buy', AssetController.buy);

// 卖出资产
/**
 * @swagger
 * /api/sell:
 *   post:
 *     summary: Execute sell transaction
 *     description: Sells specified quantity of an asset with automatic price lookup and holdings validation
 *     tags: [Assets Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - name
 *               - quantity
 *               - tradeDate
 *             properties:
 *               symbol:
 *                 type: string
 *                 example: "AAPL"
 *                 description: Asset ticker symbol
 *               name:
 *                 type: string
 *                 example: "Apple Inc."
 *                 description: Full asset name
 *               quantity:
 *                 type: number
 *                 minimum: 0.0001
 *                 example: 10
 *                 description: Quantity to sell (must be positive)
 *               tradeDate:
 *                 type: string
 *                 format: date
 *                 pattern: '^\d{4}-\d{2}-\d{2}$'
 *                 example: "2023-08-15"
 *                 description: Trade date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Sell order executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transactionId:
 *                   type: string
 *                   format: uuid
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 message:
 *                   type: string
 *                   example: "Sold 10.5 shares of AAPL successfully"
 *       400:
 *         description: Invalid input or insufficient holdings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Insufficient holdings: AAPL current 5.0000, attempting to sell 10.5"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to process sell order"
 */
router.post('/sell', AssetController.sell);

// 查询持仓
/**
 * @swagger
 * /api/holdings:
 *   get:
 *     summary: Get portfolio holdings
 *     description: Retrieve portfolio holdings with FIFO calculation and automatic price lookup as of target date
 *     tags: [Assets Transactions]
 *     parameters:
 *       - in: query
 *         name: targetDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           pattern: '^\d{4}-\d{2}-\d{2}$'
 *         example: "2023-12-31"
 *         description: Target date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Portfolio holdings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     targetDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-07-30"
 *                     holdings:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           symbol:
 *                             type: string
 *                             example: "AAPL"
 *                           name:
 *                             type: string
 *                             example: "Apple Inc."
 *                           quantity:
 *                             type: string
 *                             example: "10.5000"
 *                           avgCost:
 *                             type: string
 *                             example: "145.2500"
 *                           latestPrice:
 *                             type: string
 *                             example: "150.7500"
 *                           marketValue:
 *                             type: string
 *                             example: "1582.8750"
 *                           unrealizedProfit:
 *                             type: string
 *                             example: "57.7500"
 *                           realizedProfit:
 *                             type: string
 *                             example: "25.5000"
 *                           profitRate:
 *                             type: string
 *                             example: "3.79%"
 *                           holdingPercentage:
 *                             type: string
 *                             example: "12.34%"
 *                     totalMarketValue:
 *                       type: string
 *                       example: "125000.50"
 *                     totalRealizedProfit:
 *                       type: string
 *                       example: "3250.75"
 *                     totalAsset:
 *                       type: string
 *                       example: "128251.25"
 *       400:
 *         description: Invalid date format or missing parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Please provide targetDate in YYYY-MM-DD format"
 *       404:
 *         description: No price data available for target date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No price data available for 2023-12-31"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve portfolio holdings"
 */
router.get('/holdings', AssetController.getHoldings);

export default router;