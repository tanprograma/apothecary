import Express from 'express';

import { SaleModel } from '../models/sale';

import { ProductModel } from '../models/product';
import { StoreModel } from '../models/store';
import { SaleUtil } from '../utilities/sale.util';
import { sell } from '../models/inventory';
const router = Express.Router();
router.get('/', async (req, res) => {
  const query = req.query;

  try {
    const data = await SaleUtil.find(
      { ProductModel, StoreModel, SaleModel },
      query
    );
    res.send(new SaleUtil(data).summary());
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
  res.send(sale);
});
router.post('/createmany', async (req, res) => {
  const sales = await SaleModel.create(req.body);
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
