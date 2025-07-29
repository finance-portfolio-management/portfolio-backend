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
// // 导出路由


// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     # 资产创建时的请求体模型（POST /api/assets）
//  *     AssetCreate:
//  *       type: object
//  *       required:
//  *         - symbol
//  *         - name
//  *         - type
//  *         - price
//  *       properties:
//  *         symbol:
//  *           type: string
//  *           example: AAPL
//  *           description: 资产唯一代码（必填）
//  *         name:
//  *           type: string
//  *           example: 苹果公司股票
//  *           description: 资产名称（必填）
//  *         type:
//  *           type: string
//  *           enum: [stock, bond, fund, crypto]
//  *           example: stock
//  *           description: 资产类型（必填，股票/债券/基金/加密货币）
//  *         price:
//  *           type: number
//  *           example: 185.5
//  *           description: 当前价格（必填，单位：元/美元等）
//  *         description:
//  *           type: string
//  *           example: 美国苹果公司发行的普通股
//  *           description: 资产描述（可选）
//  *     
//  *     # 资产更新时的请求体模型（PUT /api/assets/{symbol}）
//  *     AssetUpdate:
//  *       type: object
//  *       properties:
//  *         name:
//  *           type: string
//  *           example: 苹果公司（AAPL）普通股
//  *           description: 新资产名称（可选）
//  *         price:
//  *           type: number
//  *           example: 186.0
//  *           description: 新当前价格（可选）
//  *         description:
//  *           type: string
//  *           example: 美国苹果公司发行的A类普通股
//  *           description: 新资产描述（可选）
//  *       description: 仅需传递需要更新的字段（无需传全部）
//  *     
//  *     # 资产详情模型（GET /api/assets/{symbol} 响应）
//  *     Asset:
//  *       allOf:
//  *         - $ref: '#/components/schemas/AssetCreate'
//  *         - type: object
//  *           properties:
//  *             createdAt:
//  *               type: string
//  *               format: date-time
//  *               example: "2024-01-01T10:00:00Z"
//  *               description: 资产创建时间
//  *             updatedAt:
//  *               type: string
//  *               format: date-time
//  *               example: "2024-06-15T14:30:00Z"
//  *               description: 资产最后更新时间
//  *     
//  *     # 历史行情数据模型（GET /api/assets/{symbol}/historical 响应）
//  *     HistoricalData:
//  *       type: object
//  *       properties:
//  *         timestamp:
//  *           type: string
//  *           format: date-time
//  *           example: "2024-06-15T09:30:00Z"
//  *           description: 数据时间戳（精确到分钟/小时，取决于数据源）
//  *         open:
//  *           type: number
//  *           example: 185.2
//  *           description: 开盘价
//  *         high:
//  *           type: number
//  *           example: 186.5
//  *           description: 当日最高价
//  *         low:
//  *           type: number
//  *           example: 184.8
//  *           description: 当日最低价
//  *         close:
//  *           type: number
//  *           example: 186.0
//  *           description: 收盘价
//  *         volume:
//  *           type: number
//  *           example: 12345678
//  *           description: 成交量（如股票的手数/加密货币的数量）
//  */