// const swaggerJsDoc = require("swagger-jsdoc");
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Finance Management System API Documentation",
      version: "1.0.0",
      description: " ",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Environment",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      // 将以下内容添加到这里
      schemas: {

        
        Asset: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            symbol: {
              type: 'string',
              example: 'AAPL',
            },
            name: {
              type: 'string',
              example: 'Apple Inc.',
            },
            type: {
              type: 'string',
              enum: ['stock', 'crypto', 'etf'],
              example: 'stock',
            },
            exchange: {
              type: 'string',
              example: 'NASDAQ',
            },
            current_price: {
              type: 'number',
              format: 'float',
              example: 175.62,
            },
            price_updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2023-08-20T14:30:00Z',
            },
          },
        },
        HistoricalData: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
              example: '2023-01-03'
            },
            open: {
              type: 'number',
              format: 'float',
              example: 130.28
            },
            high: {
              type: 'number',
              format: 'float',
              example: 130.90
            },
            low: {
              type: 'number',
              format: 'float',
              example: 124.17
            },
            close: {
              type: 'number',
              format: 'float',
              example: 125.07
            },
            volume: {
              type: 'integer',
              example: 112117500
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Symbol is required',
            },
          },
        },
        
        // 单个涨跌股票项
      TopGainerLoserItem: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: '股票唯一ID',
            example: 1,
          },
          symbol: {
            type: 'string',
            description: '股票代码（含交易所后缀）',
            example: 'AAPL',
          },
          name: {
            type: 'string',
            description: '股票名称',
            example: 'Apple Inc.',
          },
          currentPrice: {
            type: 'string',
            description: '当前价格（美元/人民币等，保留2位小数）',
            example: '192.45',
          },
          growthRate: {
            type: 'string',
            description: '涨跌幅（百分比，保留2位小数，正数为涨，负数为跌）',
            example: '2.35',  // 涨幅2.35%
            // 若允许负数示例可写：'-1.20'（跌幅1.20%）
          },
        },
        required: ['id', 'symbol', 'name', 'currentPrice', 'growthRate'],
      },

      // 涨跌榜响应结构
      TopGainersLosersResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: '请求是否成功',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              topGainers: {
                type: 'array',
                description: '前5名涨幅股票列表',
                items: {
                  $ref: '#/components/schemas/TopGainerLoserItem',
                },
                example: [  // 示例数据（实际根据接口返回调整）
                  {
                    id: 1,
                    symbol: 'AAPL',
                    name: 'Apple Inc.',
                    currentPrice: '192.45',
                    growthRate: '2.35',
                  },
                  {
                    id: 2,
                    symbol: 'MSFT',
                    name: 'Microsoft Corporation',
                    currentPrice: '340.67',
                    growthRate: '1.89',
                  },
                ],
              },
              topLosers: {
                type: 'array',
                description: '前5名跌幅股票列表',
                items: {
                  $ref: '#/components/schemas/TopGainerLoserItem',
                },
                example: [  // 示例数据（实际根据接口返回调整）
                  {
                    id: 10,
                    symbol: 'SHEL',
                    name: 'Shell plc',
                    currentPrice: '85.20',
                    growthRate: '-0.93',
                  },
                  {
                    id: 7,
                    symbol: '600519.SS',
                    name: 'guizhou Moutai',
                    currentPrice: '1680.00',
                    growthRate: '-0.71',
                  },
                ],
              },
            },
            required: ['topGainers', 'topLosers'],
          },
        },
        required: ['success', 'data'],
      },

      // 错误响应结构
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            description: '错误信息',
            example: 'Internal Server Error',
          },
        },
        required: ['success', 'error'],
      },

        // 资产创建请求体
        // AssetCreate: {
        //   type: "object",
        //   required: ["symbol", "name", "type", "price"],
        //   properties: {
        //     symbol: {
        //       type: "string",
        //       example: "AAPL",
        //       description: "资产唯一代码（如股票代码）",
        //     },
        //     name: {
        //       type: "string",
        //       example: "苹果公司股票",
        //       description: "资产全称",
        //     },
        //     type: {
        //       type: "string",
        //       enum: ["stock", "bond", "fund", "crypto"],
        //       example: "stock",
        //       description: "资产类型",
        //     },
        //     price: {
        //       type: "number",
        //       example: 185.5,
        //       description: "当前价格（单位：元/美元）",
        //     },
        //   },
        // },

        // // 资产详情响应体
        // Asset: {
        //   allOf: [
        //     { $ref: "#/components/schemas/AssetCreate" },
        //     {
        //       type: "object",
        //       properties: {
        //         id: {
        //           type: "string",
        //           example: "asset_123",
        //           description: "数据库唯一ID",
        //         },
        //         createdAt: {
        //           type: "string",
        //           format: "date-time",
        //           example: "2024-01-01T10:00:00Z",
        //           description: "创建时间",
        //         },
        //       },
        //     },
        //   ],
        // },

        // // 历史行情数据
        // HistoricalData: {
        //   type: "object",
        //   properties: {
        //     timestamp: {
        //       type: "string",
        //       format: "date-time",
        //       example: "2024-06-15T09:30:00Z",
        //       description: "数据时间戳",
        //     },
        //     open: {
        //       type: "number",
        //       example: 185.2,
        //       description: "开盘价",
        //     },
        //     high: {
        //       type: "number",
        //       example: 186.5,
        //       description: "最高价",
        //     },
        //     low: {
        //       type: "number",
        //       example: 184.8,
        //       description: "最低价",
        //     },
        //     close: {
        //       type: "number",
        //       example: 186.0,
        //       description: "收盘价",
        //     },
        //     volume: {
        //       type: "number",
        //       example: 12345678,
        //       description: "成交量",
        //     },
        //   },
        // },

      },
    },
  },
  // 自动扫描 routes/ 目录下的所有 .js 文件
  // apis: ["./src/routes/*.js"],
  apis: [
    path.join(__dirname, '../routes/*.js'),  // 使用绝对路径
    path.join(__dirname, '../routes/assetRoutes.js') // 明确指定文件
    , path.join(__dirname, '../routes/marketRoutes.js')
  ]
};

const specs = swaggerJsDoc(options);


// 先打印调试信息
console.log('扫描的文件路径:', options.apis);
console.log('生成的路径:', Object.keys(specs.paths));
export default specs; 

// module.exports = specs;


