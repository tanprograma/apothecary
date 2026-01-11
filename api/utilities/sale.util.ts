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
  constructor(private DB: { prescriptions: any[] }) {}
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
    const sales = this.DB.prescriptions.map((prescription) => {
      return this.mapPrescription(prescription);
    });
    return sales;
    // console.log(sales[0]);
    // return [];
  }
  private mapPrescription({ store, products, createdAt }: any) {
    // returns a mapped prescription which is usable

    return {
      store: store.name,
      products: products.map((p: any) => {
        // const product = this.findProduct(p.product);
        return {
          unit: p.unit,
          unit_value: p.unit_value,
          product: p.product.name,
          price: p.price,
          quantity: p.quantity,
          category: p.product.category,
        };
      }),
      createdAt,
    };
  }
  // private findProduct(id: any) {
  //   return this.DB.products.find((p) => p._id == id);
  // }
  // private findStore(id: any) {
  //   return this.DB.stores.find((p) => p._id == id);
  // }
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
    item.products.forEach((prescriptionItem: any) => {
      const found = summary[prescriptionItem.product.name];
      if (!found) {
        this.findLargestUnit(prescriptionItem.product.units);
        summary[prescriptionItem.product.name] = {
          product: prescriptionItem.product.name,
          unit: this.findLargestUnit(prescriptionItem.product.units).name,
          unit_value: this.findLargestUnit(prescriptionItem.product.units)
            .value,
          quantity: 0,
          amount: prescriptionItem.price * prescriptionItem.quantity,
        };
        return;
      }

      summary[prescriptionItem.product.name] = {
        ...found,
        quantity:
          found.quantity +
          prescriptionItem.quantity * prescriptionItem.unit_value,
        amount:
          (found.amount as number) +
          prescriptionItem.price * prescriptionItem.quantity,
      };
    });
  }
  private createSummaryContainer() {
    const summary = new Summary();
    // this.DB.products.forEach((item) => {
    //   const largestUnit = this.findLargestUnit(item.units);
    //   summary[item._id] = {
    //     product: item.name,
    //     unit: largestUnit.name,
    //     unit_value: largestUnit.value,
    //     quantity: 0,
    //     amount: 0,
    //   };
    // });
    return summary;
  }
  private findLargestUnit(units: any[]) {
    return units.sort((a: any, b: any) => {
      if (a.value > b.value) return -1;
      if (a.value < b.value) return 1;
      return 0;
    })[0];
  }
  static async find(models: { SaleModel: any }, query: any) {
    const findOptions = SaleUtil.queryReducer(query);

    const prescriptions = !!query.limit
      ? await models.SaleModel.find(findOptions)
          .sort({ createdAt: -1 })
          .limit(parseInt(query.limit))
          .populate([{ path: 'store' }, { path: 'products.product' }])
      : await models.SaleModel.find(findOptions)
          .populate([{ path: 'store' }, { path: 'products.product' }])
          .sort({ createdAt: -1 });

    return !!query.product
      ? {
          prescriptions: prescriptions.map(
            ({ store, products, createdAt }: ISale) => ({
              store,
              createdAt,
              products: products.filter(
                (item) => item.product._id == query.product
              ),
            })
          ) as any[],
        }
      : {
          prescriptions: prescriptions as any[],
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
