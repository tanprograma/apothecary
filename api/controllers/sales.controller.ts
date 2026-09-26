import { ProductModel } from '../models/product';
import { SaleModel } from '../models/sale';
import { Request, Response } from 'express';
import { StoreModel } from '../models/store';
export async function harmonizeSales(req: Request, res: Response) {
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
      SaleModel.find({
        createdAt: dateFilter,
      }).sort({ createdAt: -1 }),
      ProductModel.find(),
      StoreModel.find(),
    ]);

    const data = saleReducer(sales, products, stores);
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export async function harmonizeSalesCompressed(req: Request, res: Response) {
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
      SaleModel.find({
        createdAt: dateFilter,
      }).sort({ createdAt: -1 }),
      ProductModel.find(),
    ]);

    const data = saleReducerCompressed(sales, products);
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export async function harmonizeSalesDaily(req: Request, res: Response) {
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
      SaleModel.find({
        createdAt: dateFilter,
      }).sort({ createdAt: -1 }),
      ProductModel.find(),
    ]);

    const data = saleReducerDaily(sales, products);
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export function saleReducer(sales: any[], products: any[], stores: any[]) {
  let start: any[] = [];
  const data = sales.reduce((cumm: any[], current: any) => {
    const location = find(stores, current.store);
    cumm.push(
      ...current.products.map((item: any) => {
        return {
          productName: find(products, item.product).name,
          quantity: item.quantity * item.unit_value,
          date: current.createdAt,
          location: location.name,
        };
      }),
    );
    return cumm;
  }, start);
  return data;
}
export function saleReducerCompressed(sales: any[], products: any[]) {
  const start: SaleRecord = {};
  const data = sales.reduce((cumm: SaleRecord, current: any) => {
    current.products.forEach((item: any) => {
      const product = find(products, item.product);
      // check availability in the dictionary
      if (!cumm[product._id]) {
        cumm[product._id] = {
          productName: product.name,
          quantity: item.quantity * item.unit_value,
        };
      } else {
        cumm[product._id] = {
          ...cumm[product._id],
          quantity:
            cumm[product._id].quantity + item.quantity * item.unit_value,
        };
      }
    });

    return cumm;
  }, start);
  return Object.values(data);
}
export function saleReducerDaily(sales: any[], products: any[]) {
  const start: SaleRecord = {};
  const data = sales.reduce((cumm: SaleRecord, current: any) => {
    current.products.forEach((item: any) => {
      const date = new Date(new Date(current.createdAt).toLocaleDateString());
      const product = find(products, item.product);
      const identifier = `${product._id}_${date.getTime()}`;
      // check availability in the dictionary
      if (!cumm[identifier]) {
        cumm[identifier] = {
          productName: product.name,
          quantity: item.quantity * item.unit_value,
          date: date.toISOString(),
        };
      } else {
        cumm[identifier] = {
          ...cumm[identifier],
          quantity: cumm[identifier].quantity + item.quantity * item.unit_value,
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
  { productName: string; quantity: number; date?: any }
>;
