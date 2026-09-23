import { models } from 'mongoose';
import { TransactionItem } from '../../src/app/interfaces/transaction-item';
import { SaleModel } from '../models/sale';

import { ISale } from '../../src/app/app-stores/sale.store';
import { findIndex } from 'rxjs';
import { StatisticQuery } from '../../src/app/interfaces/statistics';
class Summary {
  [product: string]: any;
}
export class SaleUtil {
  constructor(
    private DB: { stores: any[]; products: any[]; prescriptions: any[] }
  ) {}
  summary() {
    let summary = this.createSummaryContainer();
    summary = this.__getSummary(summary);
    return this.mapSummary(summary);
  }
  private __getSummary(summary: Summary) {
    for (let prescription of this.DB.prescriptions) {
      for (let item of prescription.products) {
        this.addToSummary(summary, item);
      }
    }
    return summary;
  }
  transform() {
    return this.DB.prescriptions.map((prescription) => {
      return this.mapPrescription(prescription);
    });
  }
  private mapPrescription({ store, products, createdAt }: any) {
    // returns a mapped prescription which is usable

    return {
      store: this.findStore(store).name,
      products: products.map((p: any) => {
        const product = this.findProduct(p.product);
        return {
          unit: p.unit,
          unit_value: p.unit_value,
          product: product.name,
          price: p.price,
          quantity: p.quantity,
          category: product.category,
        };
      }),
      createdAt,
    };
  }
  private findProduct(id: any) {
    return this.DB.products.find((p) => p._id == id);
  }
  private findStore(id: any) {
    return this.DB.stores.find((p) => p._id == id);
  }
  private mapSummary(summary: Summary) {
    return Object.values(summary).map((item) => {
      return {
        amount: item.amount,
        unit: item.unit,
        product: item.product,
        quantity: Math.ceil(item.quantity / item.unit_value),
      };
    });
  }
  private addToSummary(summary: Summary, item: any) {
    const found = summary[item.product];

    summary[item.product] = {
      ...found,
      quantity: found.quantity + item.quantity * item.unit_value,
      amount: (found.amount as number) + item.price * item.quantity,
    };
  }
  private createSummaryContainer() {
    const summary = new Summary();
    this.DB.products.forEach((item) => {
      const largestUnit = this.findLargestUnit(item.units);
      summary[item._id] = {
        product: item.name,
        unit: largestUnit.name,
        unit_value: largestUnit.value,
        quantity: 0,
        amount: 0,
      };
    });
    return summary;
  }
  private findLargestUnit(units: any[]) {
    return units.sort((a: any, b: any) => {
      if (a.value > b.value) return -1;
      if (a.value < b.value) return 1;
      return 0;
    })[0];
  }
  static async find(
    models: { ProductModel: any; StoreModel: any; SaleModel: any },
    query: any
  ) {
    const findOptions = SaleUtil.queryReducer(query);

    const [prescriptions, stores, products] = await Promise.all([
      !!query.limit
        ? models.SaleModel.find(findOptions)
            .sort({ createdAt: -1 })
            .limit(parseInt(query.limit))
        : models.SaleModel.find(findOptions).sort({ createdAt: -1 }),
      models.StoreModel.find(),
      models.ProductModel.find(),
    ]);

    return !!query.product
      ? {
          prescriptions: prescriptions.map(
            ({ store, products, createdAt }: ISale) => ({
              store,
              createdAt,
              products: products.filter(
                (item) => item.product == query.product
              ),
            })
          ) as any[],
          stores: stores as any[],
          products: products as any[],
        }
      : {
          prescriptions: prescriptions as any[],
          stores: stores as any[],
          products: products as any[],
        };
  }

  static filterPrescription(prescriptions: any[], query: any) {
    try {
      return prescriptions.map((prescription) => {
        return {
          ...prescription,
          products: prescription.products.filter((item: any) => {
            if (!!query.product) {
              return item.product == query.product;
            } else {
              return true;
            }
          }),
        };
      });
    } catch (error) {
      return [];
    }
  }

  static queryReducer({ product, store, start, end }: StatisticQuery) {
    const reducedQuery: { [key: string]: any } = {};
    if (!!product) {
      reducedQuery['products.product'] = product;
    }
    if (!!store) {
      reducedQuery['store'] = store;
    }
    if (!!start && !!end) {
      reducedQuery['createdAt'] = { $gte: start, $lte: end };
    } else {
      if (!!start && !end) {
        reducedQuery['createdAt'] = { $gte: start };
      } else if (!start && !!end) {
        reducedQuery['createdAt'] = { $lte: end };
      }
    }
    return reducedQuery;
  }
}
