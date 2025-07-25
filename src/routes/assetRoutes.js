import {Router} from 'express';
import { addAsset, listAssets, getAsset, deleteAsset, updateAsset} from '../controllers/assetController.js';
import { getHistoricalData, syncHistoricalData } from '../controllers/assetController.js';

const router = Router();

router.post('/', addAsset);

router.get('/', listAssets);

router.get('/:symbol', getAsset);

router.delete('/:symbol', deleteAsset);

router.put('/:symbol', updateAsset);

router.get('/:symbol/historical', getHistoricalData);

router.post('/:symbol/historical/sync', syncHistoricalData);

export default router;