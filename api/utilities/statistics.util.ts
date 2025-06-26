import { IInventory } from '../../src/app/app-stores/inventory.store';
import { IStore } from '../../src/app/app-stores/outlet.store';
import { PurchaseSummary } from '../../src/app/app-stores/purchases.store';
import { SalesSummary } from '../../src/app/app-stores/sale.store';

import { Product } from '../../src/app/interfaces/product';

class Summary<T> {
  [key: string]: T;
}

export class SummaryStats {
  constructor(
    private products: Product[],

    private inventories: IInventory<string, string>[]
  ) {}

  get salesSummary() {
    return this.createSalesSummary();
  }
  get purchaseSummary() {
    return this.createPurchasesSummary();
  }
  private createSalesSummary() {
    const summary = new Summary<SalesSummary>();
    const raw = this.inventories.reduce(
      (cum: Summary<SalesSummary>, curr: IInventory<string, string>) => {
        const found = cum[curr.product];
        if (!!found) {
          // found then aggregate quantity and amount
          cum[curr.product] = {
            ...found,
            quantity: found.quantity + curr.sales.quantity,
            amount: found.amount + curr.sales.amount,
          };
        } else {
          cum[curr.product] = {
            product: curr.product,
            quantity: curr.sales.quantity,
            unit: '',
            amount: curr.sales.amount,
          };
        }
        return cum;
      },
      summary
    );
    return Object.values(raw).map((item: SalesSummary) => {
      const product = this.findProduct(item.product) as Product;
      const unit = this.findLargestUnit(product.units);
      return {
        ...item,
        product: product.name,
        unit: unit.name,
        quantity: Math.ceil(item.quantity / unit.value),
      };
    });
  }
  private createPurchasesSummary() {
    const summary = new Summary<PurchaseSummary>();
    const raw = this.inventories.reduce(
      (cum: Summary<PurchaseSummary>, curr: IInventory<string, string>) => {
        const found = cum[curr.product];
        if (!!found) {
          // found then aggregate quantity and amount
          cum[curr.product] = {
            ...found,
            requested: found.requested + curr.purchases.quantity,
            received: found.requested + curr.purchases.quantity,
            amount: found.amount + curr.purchases.amount,
          };
        } else {
          cum[curr.product] = {
            product: curr.product,
            requested: Math.ceil(curr.purchases.quantity),
            received: Math.ceil(curr.purchases.quantity),
            unit: '',
            unit_value: 0,
            amount: curr.purchases.amount,
          };
        }
        return cum;
      },
      summary
    );
    return Object.values(raw).map((item: PurchaseSummary) => {
      const product = this.findProduct(item.product) as Product;
      const unit = this.findLargestUnit(product.units);
      return {
        ...item,
        product: product.name,
        unit: unit.name,
        unit_value: unit.value,
        received: item.received / unit.value,
        requested: item.received / unit.value,
      };
    });
  }

  private findProduct(id: any) {
    return this.products.find((p) => p._id == id);
  }

  getInventoryItemValue(inventoryItem: any) {
    //   returns the value of inventory
    const smallestPrice = this.findSmallestPrice(inventoryItem.prices).value;
    return (smallestPrice * inventoryItem.quantity) as number;
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
}
