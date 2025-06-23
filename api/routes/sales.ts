import Express from 'express';

import { SaleModel } from '../models/sale';

import { ProductModel } from '../models/product';
import { StoreModel } from '../models/store';
import { SaleUtil } from '../utilities/sale.util';
import { addSalesInfo, InventoryModel, sell } from '../models/inventory';
import { InventoriesStore } from '../../src/app/app-stores/inventory.store';
import { SummaryStats } from '../utilities/statistics.util';
import { createDateQuery } from '../utilities/util';

const router = Express.Router();
router.get('/', async (req, res) => {
  const dateOptions = createDateQuery(req.query);
  const { storeID } = req.query;

  try {
    const [inventories, products] = await Promise.all([
      !!storeID
        ? InventoryModel.find({ store: storeID, ...dateOptions })
        : InventoryModel.find(dateOptions),
      ProductModel.find(),
    ]);
    const stats = new SummaryStats(products, inventories).salesSummary;

    res.send(new SummaryStats(products, inventories).salesSummary);
  } catch (error) {
    res.send([]);
  }
});

router.get('/count', async (req, res) => {
  const { store } = req.query;
  const filter = !!store ? { store: store as string } : {};
  const query = await SaleModel.countDocuments(filter);

  res.send({ query });
});
router.get('/store/:id', async (req, res) => {
  const query = req.query;
  const { id } = req.params;

  const data = await SaleUtil.find(
    { ProductModel, StoreModel, SaleModel },
    { ...query, store: id }
  );

  res.send(new SaleUtil(data).transform());
});
router.get('/store/:id/summary', async (req, res) => {
  const query = req.query;
  const { id } = req.params;

  const data = await SaleUtil.find(
    { ProductModel, StoreModel, SaleModel },
    { ...query, store: id }
  );

  try {
    res.send(new SaleUtil(data).summary());
  } catch (error) {
    console.log((error as { message: string }).message);
    res.send([]);
  }
});
router.post('/create', async (req, res) => {
  const sale = await SaleModel.create(req.body);

  for (let item of sale.products) {
    await sell(item, sale.store);
  }
  res.send({
    status: true,
    result: sale,
  });
});
router.post('/migrate', async (req, res) => {
  const sale = await SaleModel.create(req.body);
  for (let item of sale.products) {
    await sell(item, sale.store, true);
  }
  // await addSalesInfo(sale, true);
  res.send(sale);
});
router.post('/createmany', async (req, res) => {
  const sales: any = await SaleModel.create(req.body);
  for (let sale of sales) {
    for (let item of sale.products) {
      await sell(item, sale.store, true);
    }
  }
  res.send({ status: true, result: sales });
});
router.patch('/change-date', async (req, res) => {
  // changing date for dispensed items
  const { date, transactionID } = req.body;

  try {
    const sale = await SaleModel.findOne({ _id: transactionID });
    if (!!sale) {
      const new_sale = await SaleModel.create({
        store: sale.store,
        discount: sale.discount || 0,
        customer: sale.customer || '',
        createdAt: new Date(date).toISOString(),
        products: sale.products,
      });
    }
    await SaleModel.deleteOne({ _id: transactionID });
    res.send({ status: true });
  } catch (error) {
    res.send({ status: false });
  }
});

export default router;
