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
export function saleReducer(sales: any[], products: any[], stores: any[]) {
  let start: any[] = [];
  const data = sales.reduce((cumm: any[], current: any) => {
    const location = find(stores, current.store);
    cumm.push(
      ...current.products.map((item: any) => {
        return {
          productName: find(products, item.product),
          quantity: item.quantity * item.unit_value,
          date: current.createdAt,
          location,
        };
      }),
    );
    return cumm;
  }, start);
  return data;
}
function find(resources: any[], identifier: any) {
  return resources.find(
    (item) => item.name == identifier || item._id == identifier,
  );
}
