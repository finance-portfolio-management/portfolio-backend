import {Router} from 'express';
import { addAsset, listAssets, getAsset, deleteAsset, updateAsset} from '../controllers/assetController.js';

import { getHistoricalData, syncHistoricalData } from '../controllers/assetController.js';

import express from "express";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Assets
 *   description: 资产（股票/基金/债券等）管理接口
 */
/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: 添加新资产
 *     description: 通过股票/加密货币代码从Yahoo Finance同步资产信息并保存
 *     tags: [Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: 'object'
 *             required:
 *               - symbol
 *             properties:
 *               symbol:
 *                 type: 'string'
 *                 example: 'AAPL'
 *                 description: '资产代码 (如股票代码/加密货币符号)'
 *     responses:
 *       201:
 *         description: 资产添加成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *               example:
 *                 success: true
 *                 data:
 *                   id: 123
 *                   symbol: 'AAPL'
 *                   name: 'Apple Inc.'
 *                   type: 'stock'
 *                   exchange: 'NASDAQ'
 *                   current_price: 175.62
 *                   price_updated_at: '2023-08-20T14:30:00Z'
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: 'Symbol is required'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: 'Failed to fetch data from Yahoo Finance'
 */
router.post('/', addAsset);
/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: 获取所有资产列表
 *     description: 获取系统中所有资产信息，按资产代码排序
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: 成功获取资产列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Asset'
 *             example:
 *               success: true
 *               data:
 *                 - id: 123
 *                   symbol: 'AAPL'
 *                   name: 'Apple Inc.'
 *                   type: 'stock'
 *                   exchange: 'NASDAQ'
 *                   current_price: 175.62
 *                   price_updated_at: '2023-08-20T14:30:00Z'
 *                 - id: 124
 *                   symbol: 'MSFT'
 *                   name: 'Microsoft Corporation'
 *                   type: 'stock'
 *                   exchange: 'NASDAQ'
 *                   current_price: 328.39
 *                   price_updated_at: '2023-08-20T14:30:00Z'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: '数据库查询失败'
 */
router.get('/', listAssets);
/**
 * @swagger
 * /api/assets/{symbol}:
 *   get:
 *     summary: 根据代码获取资产详情
 *     description: 通过资产代码(股票/加密货币符号)获取特定资产的详细信息
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: 'AAPL'
 *         description: 资产代码 (如股票代码/加密货币符号)
 *     responses:
 *       200:
 *         description: 成功获取资产信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Asset'
 *             example:
 *               success: true
 *               data:
 *                 id: 123
 *                 symbol: 'AAPL'
 *                 name: 'Apple Inc.'
 *                 type: 'stock'
 *                 exchange: 'NASDAQ'
 *                 current_price: 175.62
 *                 price_updated_at: '2023-08-20T14:30:00Z'
 *       404:
 *         description: 资产未找到
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: 'Asset not found'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: '数据库查询失败'
 */
router.get('/:symbol', getAsset);
/**
 * @swagger
 * /api/assets/{symbol}:
 *   delete:
 *     summary: 删除指定资产
 *     description: 根据资产代码(股票/加密货币符号)删除特定资产
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: 'AAPL'
 *         description: 资产代码 (如股票代码/加密货币符号)
 *     responses:
 *       200:
 *         description: 资产删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Asset deleted successfully'
 *             example:
 *               success: true
 *               message: 'Asset deleted successfully'
 *       404:
 *         description: 资产未找到或删除失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: 'Asset not found'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: '删除资产时发生错误'
 */
router.delete('/:symbol', deleteAsset);
/**
 * @swagger
 * /api/assets/{symbol}:
 *   put:
 *     summary: 更新资产信息
 *     description: 根据资产代码更新特定资产的详细信息
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: 'AAPL'
 *         description: 资产代码 (如股票代码/加密货币符号)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Apple Inc.'
 *                 description: 资产名称
 *               type:
 *                 type: string
 *                 example: 'stock'
 *                 description: 资产类型
 *               exchange:
 *                 type: string
 *                 example: 'NASDAQ'
 *                 description: 交易所
 *               current_price:
 *                 type: number
 *                 format: float
 *                 example: 175.62
 *                 description: 当前价格
 *     responses:
 *       200:
 *         description: 资产更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Asset'
 *             example:
 *               success: true
 *               data:
 *                 id: 123
 *                 symbol: 'AAPL'
 *                 name: 'Apple Inc.'
 *                 type: 'stock'
 *                 exchange: 'NASDAQ'
 *                 current_price: 175.62
 *                 price_updated_at: '2023-08-20T14:30:00Z'
 *       404:
 *         description: 资产未找到
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: 'Asset not found'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: '更新资产时发生错误'
 */
router.put('/:symbol', updateAsset);
/**
 * @swagger
 * /api/assets/{symbol}/historical:
 *   get:
 *     summary: 获取资产历史数据
 *     description: 获取指定资产在特定时间范围内的历史价格数据，如果本地不存在会自动从Yahoo Finance同步
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         example: 'AAPL'
 *         description: 资产代码 (如股票代码/加密货币符号)
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: '2023-01-01'
 *         description: 开始日期 (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: '2023-12-31'
 *         description: 结束日期 (YYYY-MM-DD)
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: ['1d', '1wk', '1mo']
 *         default: '1d'
 *         example: '1d'
 *         description: 数据间隔 (1d-日线, 1wk-周线, 1mo-月线)
 *     responses:
 *       200:
 *         description: 成功获取历史数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HistoricalData'
 *             example:
 *               success: true
 *               data:
 *                 - date: '2023-01-03'
 *                   open: 130.28
 *                   high: 130.90
 *                   low: 124.17
 *                   close: 125.07
 *                   volume: 112117500
 *                 - date: '2023-01-04'
 *                   open: 126.89
 *                   high: 128.66
 *                   low: 125.08
 *                   close: 126.36
 *                   volume: 89113600
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: 'Start and end dates are required'
 *       404:
 *         description: 未找到历史数据
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: 'No historical data found for AAPL between 2023-01-01 and 2023-12-31'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: 'Failed to sync historical data from Yahoo Finance'
 */
router.get('/:symbol/historical', getHistoricalData);
/**
 * @swagger
 * /api/assets/{symbol}/historical/sync:
 *   post:
 *     summary: 手动同步资产的历史行情数据（从外部API拉取）
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AAPL
 *         required: true
 *         description: 要同步的资产代码
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         description: 同步起始时间（可选，默认全量同步）
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-06-30T23:59:59Z"
 *         description: 同步结束时间（可选）
 *     responses:
 *       200:
 *         description: 历史数据同步成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "资产AAPL历史数据同步完成（新增50条记录）"
 *       400:
 *         description: 时间参数格式错误
 *       404:
 *         description: 资产不存在
 */
router.post('/:symbol/historical/sync', syncHistoricalData);


export default router;