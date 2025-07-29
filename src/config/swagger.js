// const swaggerJsDoc = require("swagger-jsdoc");
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "投资组合管理系统 API",
      version: "1.0.0",
      description: "基于 Node.js 的资产、市场、投资组合管理接口",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "本地开发环境",
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
        
        // 资产创建请求体
        AssetCreate: {
          type: "object",
          required: ["symbol", "name", "type", "price"],
          properties: {
            symbol: {
              type: "string",
              example: "AAPL",
              description: "资产唯一代码（如股票代码）",
            },
            name: {
              type: "string",
              example: "苹果公司股票",
              description: "资产全称",
            },
            type: {
              type: "string",
              enum: ["stock", "bond", "fund", "crypto"],
              example: "stock",
              description: "资产类型",
            },
            price: {
              type: "number",
              example: 185.5,
              description: "当前价格（单位：元/美元）",
            },
          },
        },

        // 资产详情响应体
        Asset: {
          allOf: [
            { $ref: "#/components/schemas/AssetCreate" },
            {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  example: "asset_123",
                  description: "数据库唯一ID",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2024-01-01T10:00:00Z",
                  description: "创建时间",
                },
              },
            },
          ],
        },

        // 历史行情数据
        HistoricalData: {
          type: "object",
          properties: {
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2024-06-15T09:30:00Z",
              description: "数据时间戳",
            },
            open: {
              type: "number",
              example: 185.2,
              description: "开盘价",
            },
            high: {
              type: "number",
              example: 186.5,
              description: "最高价",
            },
            low: {
              type: "number",
              example: 184.8,
              description: "最低价",
            },
            close: {
              type: "number",
              example: 186.0,
              description: "收盘价",
            },
            volume: {
              type: "number",
              example: 12345678,
              description: "成交量",
            },
          },
        },
        
      },
    },
  },
  // 自动扫描 routes/ 目录下的所有 .js 文件
  // apis: ["./src/routes/*.js"],
  apis: [
    path.join(__dirname, '../routes/*.js'),  // 使用绝对路径
    path.join(__dirname, '../routes/assetRoutes.js') // 明确指定文件
  ]
};

const specs = swaggerJsDoc(options);


// 先打印调试信息
console.log('扫描的文件路径:', options.apis);
console.log('生成的路径:', Object.keys(specs.paths));
export default specs; 

// module.exports = specs;


