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
 *     summary: 新增一个资产
 *     tags: [Assets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetCreate'
 *     responses:
 *       201:
 *         description: 资产创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       400:
 *         description: 请求参数错误（如缺少必要字段）
 */
router.post('/', addAsset);
/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: 获取资产列表（支持分页/搜索）
 *     tags: [Assets]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: 页码（从1开始）
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: 每页显示数量（最大100）
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词（匹配资产名称或代码）
 *     responses:
 *       200:
 *         description: 成功获取资产列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Asset'
 *                 total:
 *                   type: number
 *                   description: 总资产数量
 *       500:
 *         description: 服务器内部错误
 */
router.get('/', listAssets);
/**
 * @swagger
 * /api/assets/{symbol}:
 *   get:
 *     summary: 根据资产代码获取单个资产详情
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AAPL
 *         required: true
 *         description: 资产唯一代码（如股票代码AAPL、基金代码001234）
 *     responses:
 *       200:
 *         description: 成功获取资产详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asset'
 *       404:
 *         description: 资产不存在（代码错误或未录入）
 */
router.get('/:symbol', getAsset);
/**
 * @swagger
 * /api/assets/{symbol}:
 *   delete:
 *     summary: 删除指定资产
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AAPL
 *         required: true
 *         description: 要删除的资产代码
 *     responses:
 *       200:
 *         description: 资产删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "资产AAPL删除成功"
 *       404:
 *         description: 资产不存在
 */
router.delete('/:symbol', deleteAsset);
/**
 * @swagger
 * /api/assets/{symbol}:
 *   put:
 *     summary: 更新资产信息（部分字段）
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AAPL
 *         required: true
 *         description: 要更新的资产代码
 *       - in: body
 *         name: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetUpdate'
 *     responses:
 *       200:
 *         description: 资产信息更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "资产AAPL信息更新成功"
 *       400:
 *         description: 请求参数错误（如无效字段）
 *       404:
 *         description: 资产不存在
 */
router.put('/:symbol', updateAsset);
/**
 * @swagger
 * /api/assets/{symbol}/historical:
 *   get:
 *     summary: 获取资产的历史行情数据
 *     tags: [Assets]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AAPL
 *         required: true
 *         description: 资产代码
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         description: 历史数据开始时间（可选，默认最近30天）
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-06-30T23:59:59Z"
 *         description: 历史数据结束时间（可选）
 *     responses:
 *       200:
 *         description: 成功获取历史数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HistoricalData'
 *                 symbol:
 *                   type: string
 *                   example: AAPL
 *       404:
 *         description: 资产不存在
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
