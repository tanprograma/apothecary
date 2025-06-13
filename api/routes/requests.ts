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

  const data = await RequestUtil.find(
    { ProductModel, StoreModel, RequestModel },
    query
  );
  res.send(new RequestUtil(data).summary());
});
router.get('/store/:id', async (req, res) => {
  const query = req.query;
  const { id } = req.params;
  if (!id) {
    await log({ message: 'path: api/store/id -: id is undefined' });
    res.send([]);
  } else {
    const data = await RequestUtil.find(
      { ProductModel, StoreModel, RequestModel },
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
      transaction.products = products;
      transaction.completed = true;
      await transaction.save();
      for (let item of products) {
        await issue(item, transaction.source, transaction.destination);
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
router.post('/createmany', async (req, res) => {
  const sales = await RequestModel.create(req.body);
  res.send({ status: true, result: sales });
});
export default router;
