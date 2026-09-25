import Express from 'express';

import {
  harmonizeSales,
  harmonizeSalesCompressed,
} from '../controllers/sales.controller';
import {
  harmonizePurchases,
  harmonizePurchasesCompressed,
} from '../controllers/purchase.controller';

const router = Express.Router();

router.get('/sales', harmonizeSales);
router.get('/sales/compressed', harmonizeSalesCompressed);
router.get('/purchases', harmonizePurchases);
router.get('/purchases/compressed', harmonizePurchasesCompressed);

export default router;
