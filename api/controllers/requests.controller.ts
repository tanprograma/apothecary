import { ProductModel } from '../models/product';

import { Request, Response } from 'express';
import { RequestModel } from '../models/request';
import { StoreModel } from '../models/store';
export class RequestRecords {
  model = RequestModel;
  constructor(private query: any) {}
  async requestStatus() {
    const last = await this.model
      .find()
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();
    const first = await this.model
      .find()
      .sort({ createdAt: 1 })
      .limit(1)
      .lean();
    const count = await this.model.countDocuments();

    return { start: first[0].createdAt, end: last[0].createdAt, count };
  }
  async postRequest(payload: any) {
    const created = await this.model.create(payload);
    return created;
  }
  async getRequests() {
    // creates date filter
    const query = this.parseQuery();
    // query db
    const [sales, products, stores] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }),
      ProductModel.find(),
      StoreModel.find(),
    ]);

    const data = this.recordReducer(sales, products, stores);
    return data;
  }
  async harmonizeRequests() {
    // creates date filter
    const query = this.parseQuery();
    // query db
    const [sales, products, stores] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }),
      ProductModel.find(),
      StoreModel.find(),
    ]);

    const data = this.recordReducer(sales, products, stores);
    return data;
  }
  async harmonizeRequestsCompressed() {
    // creates date filter
    const query = this.parseQuery();

    // query db
    const [sales, products] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }),
      ProductModel.find(),
    ]);

    const data = this.recordReducerCompressed(sales, products);
    return data;
  }
  async harmonizeRequestsDaily() {
    // creates date filter
    const query = this.parseQuery();

    // query db
    const [sales, products] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }),
      ProductModel.find(),
    ]);

    const data = this.recordReducerDaily(sales, products);
    return data;
  }
  recordReducer(sales: any[], products: any[], stores: any[]) {
    let start: any[] = [];
    const data = sales.reduce((cumm: any[], current: any) => {
      const location = this.find(stores, current.destination);
      cumm.push(
        ...current.products.map((item: any) => {
          return {
            productName: this.find(products, item.product).name,
            quantity: item.received * item.unit_value,
            date: current.createdAt,
            location: location.name,
          };
        }),
      );
      return cumm;
    }, start);
    return data;
  }
  async recordReducerCompressed(sales: any[], products: any[]) {
    const start: SaleRecord = {};
    const data = sales.reduce((cumm: SaleRecord, current: any) => {
      current.products.forEach((item: any) => {
        const product = this.find(products, item.product);
        // check availability in the dictionary
        if (!cumm[product._id]) {
          cumm[product._id] = {
            productName: product.name,
            quantity: item.received * item.unit_value,
          };
        } else {
          cumm[product._id] = {
            ...cumm[product._id],
            quantity:
              cumm[product._id].quantity + item.received * item.unit_value,
          };
        }
      });

      return cumm;
    }, start);
    return Object.values(data);
  }
  async recordReducerDaily(sales: any[], products: any[]) {
    const start: SaleRecord = {};
    const data = sales.reduce((cumm: SaleRecord, current: any) => {
      current.products.forEach((item: any) => {
        const date = new Date(new Date(current.createdAt).toLocaleDateString());
        const product = this.find(products, item.product);
        const identifier = `${product._id}_${date.getTime()}`;
        // check availability in the dictionary
        if (!cumm[identifier]) {
          cumm[identifier] = {
            productName: product.name,
            quantity: item.received * item.unit_value,
            date: date.toISOString(),
          };
        } else {
          cumm[identifier] = {
            ...cumm[identifier],
            quantity:
              cumm[identifier].quantity + item.received * item.unit_value,
          };
        }
      });

      return cumm;
    }, start);
    return Object.values(data);
  }
  find(resources: any[], identifier: any) {
    return resources.find(
      (item) => item.name == identifier || item._id == identifier,
    );
  }
  parseQuery() {
    const { startDate, endDate, store } = this.query;
    let filter: any = {};
    if (!!store) {
      filter = {
        ...filter,
        destination: store,
      };
    }
    let dateFilter: any = {};

    if (!!startDate) {
      dateFilter = {
        ...dateFilter,
        $gte: new Date(startDate as string).toISOString(),
      };
    }
    if (!!endDate) {
      dateFilter = {
        ...dateFilter,
        $lte: new Date(endDate as string).toISOString(),
      };
    }
    filter = { ...filter, createdAt: dateFilter };
    return filter;
  }
}

export async function requestItems(req: Request, res: Response) {
  try {
    const entry = new RequestRecords({});
    const data = await entry.postRequest(req.body);

    res.send({ status: true, data });
  } catch (error) {
    res.send({ status: false });
  }
}
export async function requestsStatus(req: Request, res: Response) {
  const entry = new RequestRecords({});
  const data = await entry.requestStatus();

  res.send(data);
}

export async function harmonizeRequests(req: Request, res: Response) {
  try {
    // creates date filter
    const entry = new RequestRecords(req.query);
    const data = await entry.harmonizeRequests();
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export async function harmonizeRequestsCompressed(req: Request, res: Response) {
  try {
    // creates date filter
    const entry = new RequestRecords(req.query);
    const data = await entry.harmonizeRequestsCompressed();
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export async function harmonizeRequestsDaily(req: Request, res: Response) {
  try {
    // creates date filter
    const entry = new RequestRecords(req.query);
    const data = await entry.harmonizeRequestsDaily();
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}

export type SaleRecord = Record<
  string,
  { productName: string; quantity: number; date?: any }
>;
