import Express from 'express';

import {
  harmonizeSales,
  harmonizeSalesCompressed,
  harmonizeSalesDaily,
  saleStatus,
} from '../controllers/sales.controller';
import {
  harmonizePurchases,
  harmonizePurchasesCompressed,
  harmonizePurchasesDaily,
  purchase,
  purchaseStatus,
} from '../controllers/purchase.controller';
import {
  harmonizeRequests,
  harmonizeRequestsCompressed,
  harmonizeRequestsDaily,
  requestsStatus,
} from '../controllers/requests.controller';
import {
  harmonizeIssues,
  harmonizeIssuesCompressed,
  harmonizeIssuesDaily,
  issuesStatus,
} from '../controllers/issue.controller';

const router = Express.Router();

router.get('/sales/status', saleStatus);
router.get('/requests/status', requestsStatus);
router.get('/purchases/status', purchaseStatus);
router.get('/issues/status', issuesStatus);
router.get('/sales/raw', harmonizeSales);
router.get('/sales/daily', harmonizeSalesDaily);
router.get('/sales/compressed', harmonizeSalesCompressed);
router.get('/purchases/raw', harmonizePurchases);
router.get('/purchases/daily', harmonizePurchasesDaily);
router.get('/purchases/compressed', harmonizePurchasesCompressed);

router.get('/requests/raw', harmonizeRequests);
router.get('/requests/daily', harmonizeRequestsDaily);
router.get('/requests/compressed', harmonizeRequestsCompressed);

router.get('/issues/raw', harmonizeIssues);
router.get('/issues/daily', harmonizeIssuesDaily);
router.get('/issues/compressed', harmonizeIssuesCompressed);

router.post('/purchases', purchase);

export default router;
