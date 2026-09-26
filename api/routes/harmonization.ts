import Express from 'express';

import {
  harmonizeSales,
  harmonizeSalesCompressed,
  harmonizeSalesDaily,
} from '../controllers/sales.controller';
import {
  harmonizePurchases,
  harmonizePurchasesCompressed,
  harmonizePurchasesDaily,
} from '../controllers/purchase.controller';
import {
  harmonizeRequests,
  harmonizeRequestsCompressed,
  harmonizeRequestsDaily,
} from '../controllers/requests.controller';

const router = Express.Router();

router.get('/sales/raw', harmonizeSales);
router.get('/sales/daily', harmonizeSalesDaily);
router.get('/sales/compressed', harmonizeSalesCompressed);
router.get('/purchases/raw', harmonizePurchases);
router.get('/purchases/daily', harmonizePurchasesDaily);
router.get('/purchases/compressed', harmonizePurchasesCompressed);
router.get('/requests/raw/:clinic', harmonizeRequests);
router.get('/requests/daily/:clinic', harmonizeRequestsDaily);
router.get('/requests/compressed/:clinic', harmonizeRequestsCompressed);

export default router;
