import { IPurchaseItem } from '../../src/app/app-stores/purchases.store';

class Summary {
  [product: string]: IPurchaseItem;
}
export class PurchaseUtil {
  constructor(
    private DB: {
      prescriptions: any[];
    }
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
    try {
      const req = this.DB.prescriptions.map((prescription) => {
        return this.mapPrescription(prescription);
      });
      return req;
    } catch (error) {
      console.log((error as { message: string }).message);
      return [];
    }
  }
  private mapPrescription({
    destination,
    source,
    products,
    createdAt,
    completed,
    _id,
  }: any) {
    // returns a mapped prescription which is usable

    return {
      _id,
      destination: destination.name,
      source: source.name,
      products: products.map((p: any) => {
        return {
          unit: p.unit,
          unit_value: p.unit_value,
          product: p.product.name,
          price: p.price,
          received: p.received,
          requested: p.requested,
        };
      }),
      createdAt,
      completed,
    };
  }
  // private findProduct(id: any) {
  //   return this.DB.products.find((p) => p._id == id);
  // }
  // private findStore(id: any) {
  //   return this.DB.stores.find((p) => p._id == id);
  // }
  // private findSupplier(id: any) {
  //   return this.DB.suppliers.find((p) => p._id == id);
  // }
  private mapSummary(summary: Summary) {
    return Object.values(summary).map((item) => {
      return {
        ...item,
        requested: Math.ceil(item.requested / item.unit_value),
        received: Math.ceil(item.received / item.unit_value),
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
          requested: prescriptionItem.requested,
          received: prescriptionItem.received,
          price: prescriptionItem.price * prescriptionItem.received,
        };
        return;
      }

      summary[prescriptionItem.product.name] = {
        ...found,
        received: found.received + item.received * item.unit_value,
        requested:
          found.requested +
          prescriptionItem.quantity * prescriptionItem.unit_value,
        price:
          (found.price as number) +
          prescriptionItem.price * prescriptionItem.received,
      };
    });
    // const found = summary[item.product];

    // summary[item.product] = {
    //   ...found,
    //   requested: found.requested + item.requested * item.unit_value,
    //   received: found.received + item.received * item.unit_value,
    //   price: (found.price as number) + item.price * item.received,
    // };
  }
  private createSummaryContainer() {
    const summary = new Summary();
    // this.DB.products.forEach((item) => {
    //   const largestUnit = this.findLargestUnit(item.units);
    //   summary[item._id] = {
    //     product: item.name,
    //     unit: largestUnit.name,
    //     unit_value: largestUnit.value,
    //     requested: 0,
    //     received: 0,
    //     price: 0,
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
  static async find(
    models: {
      PurchaseModel: any;
    },
    query: any
  ) {
    const parsedQuery = PurchaseUtil.createDateQuery(query);
    const findOptions = !!query.store
      ? {
          ...parsedQuery,
          $or: [{ source: query.store }, { destination: query.store }],
        }
      : parsedQuery;
    const prescriptions = !!query.limit
      ? await models.PurchaseModel.find(findOptions)
          .sort({ createdAt: -1 })
          .limit(parseInt(query.limit))
          .populate([
            { path: 'source' },
            { path: 'destination' },
            { path: 'products.product' },
          ])
      : await models.PurchaseModel.find(findOptions)
          .sort({ createdAt: -1 })
          .populate([
            { path: 'source' },
            { path: 'destination' },
            { path: 'products.product' },
          ]);

    return {
      prescriptions: prescriptions as any[],
    };
  }

  static createDateQuery(query: any) {
    const { start, end, limit } = query;

    if (!!start && !end) {
      return {
        createdAt: {
          $gte: new Date(parseInt(start)).toISOString(),
        },
      };
    } else if (!start && !!end) {
      return {
        createdAt: {
          $lte: new Date(parseInt(end)).toISOString(),
        },
      };
    } else if (!!start && !!end) {
      return {
        createdAt: {
          $gte: new Date(parseInt(start)).toISOString(),
          $lte: new Date(parseInt(end)).toISOString(),
        },
      };
    } else {
      return {};
    }
  }
}
