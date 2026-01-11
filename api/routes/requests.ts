import Express from 'express';
import { RequestUtil } from '../utilities/request.util';
import { ProductModel } from '../models/product';
import { RequestModel } from '../models/request';
import { StoreModel } from '../models/store';
import { issue } from '../models/inventory';
import { log } from './logs';

const router = Express.Router();
router.get('/', async (req, res) => {
  const query = req.query;

  const data = await RequestUtil.find({ RequestModel }, query);
  res.send(new RequestUtil(data).summary());
});
router.get('/query/', async (req, res) => {
  // returns data with populated store and product
  try {
    const { start, end } = req.query;
    console.log({ start, end });
    const requests = await RequestModel.find({
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'source' },
        { path: 'destination' },
        { path: 'products.product' },
      ])
      .select('source destination products createdAt');

    res.send(requests);
  } catch (error) {
    console.log((error as { message: string }).message);
    res.send([]);
  }
});
router.get('/store/:id', async (req, res) => {
  const query = req.query;
  const { id } = req.params;
  if (!id) {
    await log({ message: 'path: api/store/id -: id is undefined' });
    res.send([]);
  } else {
    const data = await RequestUtil.find(
      { RequestModel },
      { ...query, store: id }
    );

    res.send(new RequestUtil(data).transform());
  }
});
router.get('/store/issued/:id', async (req, res) => {
  // const id = req.params.id;
  // const items = await RequestUtil.getRequestsIssued(id);
  // res.send(items);
});
router.get('/store/received/:id', async (req, res) => {
  // const id = req.params.id;
  // const items = await RequestUtil.getRequestsReceived(id);
  // res.send(items);
});
router.post('/create', async (req, res) => {
  const request = await RequestModel.create(req.body);

  res.send({
    status: true,
    result: request,
  });
});
router.patch('/issue/:requestID', async (req, res) => {
  const id = req.params.requestID;
  const { products } = req.body;
  try {
    const transaction = await RequestModel.findOne({ _id: id });
    if (!!transaction) {
      transaction[products] = products;
      transaction['completed'] = true;
      await transaction.save();
      // await addReceiveInfo(transaction);
      // await addIssueInfo(transaction);
      for (let item of products) {
        await issue(item, transaction['source'], transaction['destination']);
      }
      res.send({ status: true });
    } else {
      res.send({ status: false });
    }
  } catch (error) {
    console.log((error as { message: string }).message);
    res.send({ status: false });
  }
});
router.post('/migrate', async (req, res) => {
  const transaction = await RequestModel.create(req.body);
  if (!!transaction['completed']) {
    for (let item of transaction['products'] as any[]) {
      await issue(
        item,
        transaction['source'],
        transaction['destination'],
        true
      );
    }
  }

  // await addSalesInfo(sale, true);
  res.send(transaction);
});
router.post('/createmany', async (req, res) => {
  const sales = await RequestModel.create(req.body);
  res.send({ status: true, result: sales });
});
export default router;
