import { Inventory } from '../../src/app/interfaces/inventory';

class InventoryContainer {
  [product: string]: Inventory;
}
export class InventoryUtil {
  private itemsContainer: InventoryContainer = new InventoryContainer();
  constructor(private __products: any[], private __inventory: any[]) {}
  get inventories() {
    for (let item of this.__inventory) {
      this.itemsContainer[item.product] = {
        _id: item._id,
        product: item.product,
        prices: item.prices,
        quantity: item.quantity,
        store: item.store,
      };
    }
    for (let item of this.__products) {
      this.itemsContainer[item._id] = {
        ...this.itemsContainer[item._id],
        product: {
          _id: item._id,
          name: item.name,
          units: item.units,
          category: item.category,
        },
      };
    }
    return Object.values(this.itemsContainer);
  }
}
