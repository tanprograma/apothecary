import Express from 'express';
import { InfoModel } from '../models/info.model';
import { SaleModel } from '../models/sale';
import { PurchaseModel } from '../models/purchase';
import { RequestModel } from '../models/request';
import { InventoryModel } from '../models/inventory';
import { InventoryUtil } from '../utilities/inventory.util';
const router = Express.Router();
router.get('', async (req, res) => {
  const { store } = req.query;
  const dateQuery = createDateQuery(req.query);
  const query = !!store ? { ...dateQuery, store } : dateQuery;
  const info = await Promise.all([
    SaleModel.countDocuments(query),
    PurchaseModel.countDocuments({ ...query, completed: true }),
    RequestModel.countDocuments({ ...query, completed: true }),
    InventoryModel.find(),
  ]);
  const properInfo = [
    { orders: info[0], category: 'sales' },
    { orders: info[1], category: 'purchases' },
    { orders: info[2], category: 'receive' },
    { orders: info[2], category: 'issue' },
  ];
  const data = InventoryUtil.getInfoSummary(info[3], properInfo);
  res.send(data);
});
router.post('/initialize', async (req, res) => {
  const item = await InfoModel.create(req.body);
  res.send({ result: item, status: true });
});

export default router;
function createDateQuery(query: any) {
  const { start, end, limit } = query;

  if (!!start && !end) {
    return {
      createdAt: {
        $gte: new Date(parseInt(start)).toISOString(),
      },
    };
  } else if (!start && !!end) {
    return {
      createdAt: {
        $lte: new Date(parseInt(end)).toISOString(),
      },
    };
  } else if (!!start && !!end) {
    return {
      createdAt: {
        $gte: new Date(parseInt(start)).toISOString(),
        $lte: new Date(parseInt(end)).toISOString(),
      },
    };
  } else {
    return {};
  }
}
