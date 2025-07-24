import {Router} from 'express';
import { addAsset, listAssets, getAsset } from '../controllers/assetController.js';

const router = Router();

router.post('/', addAsset);

router.get('/', listAssets);

router.get('/:symbol', getAsset);

export default router;