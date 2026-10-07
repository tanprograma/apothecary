import { ProductModel } from '../models/product';
import { SaleModel } from '../models/sale';
import { Request, Response } from 'express';
import { StoreModel } from '../models/store';
class SaleRecords {
  model = SaleModel;
  ProductModel = ProductModel;
  StoreModel = StoreModel;
  constructor(private query: any = {}) {}
  async createSale(payload: any) {
    const sale = await this.model.create(payload);

    return sale;
  }
  async saleStatus() {
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
  async harmonizeSales() {
    const query = this.parseQuery();

    // query db
    const [sales, products, stores] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }),
      this.ProductModel.find(),
      this.StoreModel.find(),
    ]);

    const data = this.saleReducer(sales, products, stores);
    return data;
  }
  async harmonizeSalesCompressed() {
    const query = this.parseQuery();

    // query db
    const [sales, products] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }),
      this.ProductModel.find(),
    ]);

    const data = this.saleReducerCompressed(sales, products);
    return data;
  }
  async harmonizeSalesDaily() {
    const query = this.parseQuery();

    // query db
    const [sales, products] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }),
      this.ProductModel.find(),
    ]);

    const data = this.saleReducerDaily(sales, products);
    return data;
  }
  parseQuery() {
    const { startDate, endDate, store } = this.query;
    let filter = {};
    if (!!store) {
      filter = { ...filter, store };
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
    return { ...filter, createdAt: dateFilter };
  }

  saleReducer(sales: any[], products: any[], stores: any[]) {
    let start: any[] = [];
    const data = sales.reduce((cumm: any[], current: any) => {
      const location = this.find(stores, current.store);
      cumm.push(
        ...current.products.map((item: any) => {
          return {
            productName: this.find(products, item.product).name,
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
  saleReducerCompressed(sales: any[], products: any[]) {
    const start: SaleRecord = {};
    const data = sales.reduce((cumm: SaleRecord, current: any) => {
      current.products.forEach((item: any) => {
        const product = this.find(products, item.product);
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
  saleReducerDaily(sales: any[], products: any[]) {
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
            quantity: item.quantity * item.unit_value,
            date: date.toISOString(),
          };
        } else {
          cumm[identifier] = {
            ...cumm[identifier],
            quantity:
              cumm[identifier].quantity + item.quantity * item.unit_value,
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
}
export async function saleStatus(req: Request, res: Response) {
  const record = new SaleRecords();
  const data = await record.saleStatus();

  res.send(data);
}
export async function createSale(req: Request, res: Response) {
  try {
    const record = new SaleRecords();
    const data = await record.createSale(req.body);
    res.send({ doc: data, status: true });
  } catch (error) {
    res.send({ status: false });
  }
}
export async function harmonizeSales(req: Request, res: Response) {
  try {
    const record = new SaleRecords(req.query);

    const data = await record.harmonizeSales();
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export async function harmonizeSalesCompressed(req: Request, res: Response) {
  try {
    const record = new SaleRecords(req.query);

    const data = await record.harmonizeSalesCompressed();
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}
export async function harmonizeSalesDaily(req: Request, res: Response) {
  try {
    const record = new SaleRecords(req.query);

    const data = await record.harmonizeSalesDaily();
    res.send(data);
  } catch (error) {
    res.send([]);
  }
}

export type SaleRecord = Record<
  string,
  { productName: string; quantity: number; date?: any }
>;
