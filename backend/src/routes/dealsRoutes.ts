import { Router } from 'express';
import { getDeals } from '../controllers/dealsController';

const router = Router();

router.get('/deals', getDeals);

export default router;
