import express from 'express';
import { getTopGainersLosers } from '../controllers/marketController.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Market
 *   description: Stock Leaderboard API
 */
/**
 * @swagger
 * /api/market/top-gainers-losers:
 *   get:
 *     summary: Top 5 Gainers and Losers
 *     description: Fetch real-time data of predefined stocks from Yahoo Finance, calculate their price changes, sort, and return top 5 gainers and losers
 *     tags: [Market]  # 接口分组标签
 *     responses:
 *       200:
 *         description: Successfully retrieved the top gainers and losers data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopGainersLosersResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/top-gainers-losers', getTopGainersLosers);

export default router;