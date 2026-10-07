import Express from 'express';

import {
  createSale,
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
  requestItems,
  requestsStatus,
} from '../controllers/requests.controller';
import {
  harmonizeIssues,
  harmonizeIssuesCompressed,
  harmonizeIssuesDaily,
  issuesStatus,
} from '../controllers/issue.controller';

const router = Express.Router();
// sales routes
router.get('/sales/status', saleStatus);
router.get('/sales/raw', harmonizeSales);
router.get('/sales/daily', harmonizeSalesDaily);
router.get('/sales/compressed', harmonizeSalesCompressed);
router.post('/sales', createSale);
// purchases routes

router.get('/purchases/status', purchaseStatus);
router.get('/issues/status', issuesStatus);
router.get('/purchases/raw', harmonizePurchases);
router.get('/purchases/daily', harmonizePurchasesDaily);
router.get('/purchases/compressed', harmonizePurchasesCompressed);
router.post('/purchases', purchase);

// requests routes
router.get('/requests/status', requestsStatus);
router.get('/requests/raw', harmonizeRequests);
router.get('/requests/raw', harmonizeRequests);
router.get('/requests/daily', harmonizeRequestsDaily);
router.get('/requests/compressed', harmonizeRequestsCompressed);
router.post('/requests', requestItems);

// issues routes
router.get('/issues/raw', harmonizeIssues);
router.get('/issues/daily', harmonizeIssuesDaily);
router.get('/issues/compressed', harmonizeIssuesCompressed);

export default router;
