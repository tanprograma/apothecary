import { TransactionItem } from '../../src/app/interfaces/transaction-item';

export class ExpiryUtil {
  constructor(
    private DB: { stores: any[]; products: any[]; prescriptions: any[] }
  ) {}

  transform() {
    return this.DB.prescriptions.map((prescription) => {
      return this.mapPrescription(prescription);
    });
  }
  private mapPrescription(item: any) {
    // returns a mapped prescription which is usable

    return {
      unit: item.unit,
      unit_value: item.unit_value,
      product: this.findProduct(item.product).name,
      price: item.price,
      quantity: item.quantity,
      store: this.findStore(item.store).name,
      expiry: item.expiry,
      destroyed: item.destroyed,
    };
  }
  private findProduct(id: any) {
    return this.DB.products.find((p) => p._id == id);
  }
  private findStore(id: any) {
    return this.DB.stores.find((p) => p._id == id);
  }
  //   private mapSummary(summary: Summary) {
  //     return Object.values(summary).map((item) => {
  //       return {
  //         ...item,
  //         quantity: Math.ceil(item.quantity / item.unit_value),
  //       };
  //     });
  //   }
  //   private addToSummary(summary: Summary, item: any) {
  //     const found = summary[item.product];

  //     summary[item.product] = {
  //       ...found,
  //       quantity: found.quantity + item.quantity * item.unit_value,
  //       price: (found.price as number) + item.price * item.quantity,
  //     };
  //   }
  //   private createSummaryContainer() {
  //     const summary = new Summary();
  //     this.DB.products.forEach((item) => {
  //       const largestUnit = this.findLargestUnit(item.units);
  //       summary[item._id] = {
  //         product: item.name,
  //         unit: largestUnit.name,
  //         unit_value: largestUnit.value,
  //         quantity: 0,
  //         price: 0,
  //       };
  //     });
  //     return summary;
  //   }
  private findLargestUnit(units: any[]) {
    return units.sort((a: any, b: any) => {
      if (a.value > b.value) return -1;
      if (a.value < b.value) return 1;
      return 0;
    })[0];
  }
  static async find(
    models: { ProductModel: any; StoreModel: any; ExpiredModel: any },
    query: any
  ) {
    const { storeID } = query;

    const [prescriptions, stores, products] = await Promise.all([
      !!storeID
        ? models.ExpiredModel.find({ store: storeID }).sort({ expiry: -1 })
        : models.ExpiredModel.find().sort({ expiry: -1 }),
      models.StoreModel.find(),
      models.ProductModel.find(),
    ]);

    return {
      prescriptions: prescriptions as any[],
      stores: stores as any[],
      products: products as any[],
    };
  }

  //   static createDateQuery(query: any) {
  //     const { start, end, limit } = query;

  //     if (!!start && !end) {
  //       return {
  //         createdAt: {
  //           $gte: new Date(parseInt(start)).toISOString(),
  //         },
  //       };
  //     } else if (!start && !!end) {
  //       return {
  //         createdAt: {
  //           $lte: new Date(parseInt(end)).toISOString(),
  //         },
  //       };
  //     } else if (!!start && !!end) {
  //       return {
  //         createdAt: {
  //           $gte: new Date(parseInt(start)).toISOString(),
  //           $lte: new Date(parseInt(end)).toISOString(),
  //         },
  //       };
  //     } else {
  //       return {};
  //     }
  //   }
}
