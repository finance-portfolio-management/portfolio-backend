import express from 'express';
import { getTopGainersLosers } from '../controllers/marketController.js';

const router = express.Router();

router.get('/top-gainers-losers', getTopGainersLosers);

export default router;