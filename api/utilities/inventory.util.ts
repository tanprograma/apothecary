import { InventorySummary } from '../../src/app/app-stores/inventory.store';

class Summary {
  [product: string]: InventorySummary;
}
export class InventoryUtil {
  constructor(
    private DB: { stores: any[]; products: any[]; prescriptions: any[] }
  ) {}
  summary() {
    //   returns summary as InventorySummary

    const summary = this.__getSummary();
    return this.mapSummary(summary);
  }
  private __getSummary() {
    let summary = this.createSummaryContainer();

    for (let prescription of this.DB.prescriptions) {
      this.addToSummary(summary, prescription);
    }
    return summary;
  }
  transform() {
    return this.DB.prescriptions.map((prescription) => {
      return this.mapPrescription(prescription);
    });
  }
  private mapPrescription({
    store,
    product,
    quantity,
    prices,
    _id,
    expiry,
  }: any) {
    // returns a mapped prescription which is usable
    const completeProduct = this.findProduct(product);
    const completeStore = this.findStore(store);
    return {
      product: {
        _id: completeProduct._id,
        name: completeProduct.name,
        units: completeProduct.units,
      },
      quantity,
      prices,
      _id,
      store: { _id: completeStore._id, name: completeStore.name },
      expiry: this.createDate(expiry),
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
        ...item,
        quantity: Math.ceil(item.quantity / item.unit_value),
      };
    });
  }
  private addToSummary(summary: Summary, item: any) {
    const found = summary[item.product];
    const unit = this.findSmallestUnit(this.findProduct(item.product).units);
    // item.unit_value does not exist on inventory
    //   1 is the smallest possible unit
    summary[item.product] = {
      ...found,
      quantity: found.quantity + item.quantity * unit.value,
      amount: (found.amount as number) + this.getInventoryItemValue(item),
    };
  }
  getInventoryItemValue(inventoryItem: any) {
    //   returns the value of inventory
    const smallestPrice = this.findSmallestPrice(inventoryItem.prices).value;
    return (smallestPrice * inventoryItem.quantity) as number;
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
  private findSmallestUnit(units: any[]) {
    return units.sort((a: any, b: any) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    })[0];
  }
  private findSmallestPrice(prices: any[]) {
    return prices.sort((a: any, b: any) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    })[0] as { unit: string; value: number };
  }
  createDate(d?: number | string) {
    if (!!d) {
      const date = new Date(d);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    } else {
      return '';
    }
  }
  static async find(
    {
      ProductModel,
      StoreModel,
      InventoryModel,
    }: { ProductModel: any; StoreModel: any; InventoryModel: any },
    query: any
  ) {
    const parsedQuery = InventoryUtil.createDateQuery(query);
    const findOptions = !!query.store
      ? { ...parsedQuery, store: query.store }
      : parsedQuery;
    const [prescriptions, stores, products] = await Promise.all([
      !!query.limit
        ? InventoryModel.find(findOptions)
            .sort({ createdAt: -1 })
            .limit(parseInt(query.limit))
        : InventoryModel.find(findOptions).sort({ createdAt: -1 }),
      StoreModel.find(),
      ProductModel.find(),
    ]);

    return {
      // prescriptions as inventories
      prescriptions: prescriptions as any[],
      stores: stores as any[],
      products: products as any[],
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
