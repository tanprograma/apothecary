import { ProductModel } from '../models/product';

import { Request, Response } from 'express';
import { RequestModel } from '../models/request';
import { StoreModel } from '../models/store';

export async function harmonizeRequests(req: Request, res: Response) {
  try {
    // creates date filter
    const { startDate, endDate } = req.query;
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

    // query db
    const [sales, products, stores] = await Promise.all([
      RequestModel.find({
        createdAt: dateFilter,
      }).sort({ createdAt: -1 }),
      ProductModel.find(),
      StoreModel.find(),
    ]);

    const data = requestReducer(sales, products, stores);
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export async function harmonizeRequestsCompressed(req: Request, res: Response) {
  try {
    // creates date filter
    const { startDate, endDate } = req.query;
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

    // query db
    const [sales, products] = await Promise.all([
      RequestModel.find({
        createdAt: dateFilter,
      }).sort({ createdAt: -1 }),
      ProductModel.find(),
    ]);

    const data = requestReducerCompressed(sales, products);
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export async function harmonizeRequestsDaily(req: Request, res: Response) {
  try {
    // creates date filter
    const { startDate, endDate } = req.query;
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

    // query db
    const [sales, products] = await Promise.all([
      RequestModel.find({
        createdAt: dateFilter,
      }).sort({ createdAt: -1 }),
      ProductModel.find(),
    ]);

    const data = requestReducerDaily(sales, products);
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export function requestReducer(sales: any[], products: any[], stores: any[]) {
  let start: any[] = [];
  const data = sales.reduce((cumm: any[], current: any) => {
    const location = find(stores, current.source);
    cumm.push(
      ...current.products.map((item: any) => {
        return {
          productName: find(products, item.product).name,
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
export function requestReducerCompressed(sales: any[], products: any[]) {
  const start: SaleRecord = {};
  const data = sales.reduce((cumm: SaleRecord, current: any) => {
    current.products.forEach((item: any) => {
      const product = find(products, item.product);
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
export function requestReducerDaily(sales: any[], products: any[]) {
  const start: SaleRecord = {};
  const data = sales.reduce((cumm: SaleRecord, current: any) => {
    current.products.forEach((item: any) => {
      const date = new Date(
        new Date(current.createdAt).toLocaleDateString(),
      ).getTime();
      const product = find(products, item.product);
      const identifier = `${product._id}_${date}`;
      // check availability in the dictionary
      if (!cumm[identifier]) {
        cumm[identifier] = {
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
function find(resources: any[], identifier: any) {
  return resources.find(
    (item) => item.name == identifier || item._id == identifier,
  );
}
export type SaleRecord = Record<
  string,
  { productName: string; quantity: number }
>;
