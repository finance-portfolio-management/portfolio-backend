import {Router} from 'express';
import { addAsset, listAssets, getAsset,deleteAsset} from '../controllers/assetController.js';


const router = Router();

router.post('/', addAsset);

router.get('/', listAssets);

router.get('/:symbol', getAsset);

router.delete('/:symbol', deleteAsset);

export default router;