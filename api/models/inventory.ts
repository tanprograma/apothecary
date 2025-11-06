import { Schema, model } from 'mongoose';
import { Inventory } from '../../src/app/interfaces/inventory';
import { AnyARecord } from 'node:dns';
import {
  IInventory,
  Info,
  InventoryInfo,
} from '../../src/app/app-stores/inventory.store';
import { ISaleItem } from '../../src/app/app-stores/sale.store';
const priceSchema = new Schema<{ unit: string; value: number }>(
  {
    unit: String,
    value: Number,
  },
  { _id: false }
);
const InfoSchema = new Schema<{
  quantity: number;
  amount: number;
  items: number;
}>(
  {
    quantity: Number,
    amount: Number,
    items: Number,
  },
  { _id: false }
);

const schema = new Schema<IInventory<string, string>>({
  store: String,
  product: String,
  tracer: Number,
  created_on: String,
  prices: [priceSchema],
  quantity: Number,
  sales: {
    type: InfoSchema,
    default: () => ({ items: 0, quantity: 0, amount: 0 }),
  },
  purchases: {
    type: InfoSchema,
    default: () => ({ items: 0, quantity: 0, amount: 0 }),
  },
  receive: {
    type: InfoSchema,
    default: () => ({ items: 0, quantity: 0, amount: 0 }),
  },
  issue: {
    type: InfoSchema,
    default: () => ({ items: 0, quantity: 0, amount: 0 }),
  },
  expiry: String,
});
export const InventoryModel = model('Inventories', schema);
function incrementInfo(current: InventoryInfo, item: any) {
  // changes info in sales,purchases etc aggregates
  const { items, amount, quantity } = current;
  return {
    ...current,
    items: items + 1,
    amount: amount + item.price * item.quantity,
    quantity: quantity + item.quantity * item.unit_value,
  };
}
function incrementInfoRequest(current: InventoryInfo, item: any) {
  // changes info in sales,purchases etc aggregates
  const { items, amount, quantity } = current;
  return {
    ...current,
    items: items + 1,
    amount: amount + item.price * item.received,
    quantity: quantity + item.received * item.unit_value,
  };
}
export async function addSalesInfo(sale: any, skipQuantity = false) {
  for (let item of sale.products) {
    await sell(item, sale.store, skipQuantity);
  }
}
export async function addPurchasesInfo(sale: any) {
  for (let item of sale.products) {
    await purchase(item, sale.store);
  }
}

export async function addIssueInfo(sale: any) {
  for (let item of sale.products) {
    await sell(item, sale.source, sale.destination);
  }
}

export async function sell(item: any, store: any, skipQuantity = false) {
  const sale = await InventoryModel.findOne({
    store: store,
    product: item.product,
  });
  if (!!sale) {
    if (!skipQuantity) {
      sale.quantity -= item.quantity * item.unit_value;
    }

    // modify sales info
    sale.sales = incrementInfo(sale.sales, item);

    await sale.save();
  }
}

export async function purchase(item: any, store: any, skipQuantity = false) {
  const sale = await InventoryModel.findOne({
    store: store,
    product: item.product,
  });
  if (!!sale) {
    if (!skipQuantity) {
      sale.quantity += item.received * item.unit_value;
    }

    sale.purchases = incrementInfoRequest(sale.purchases, item);

    await sale.save();
  }
}
export async function issue(
  item: any,
  source: any,
  destination: any,
  skipQuantity = false
) {
  // find respective inventories
  const [receivingInventory, issueInventory] = await Promise.all([
    InventoryModel.findOne({
      store: destination,
      product: item.product,
    }),
    InventoryModel.findOne({
      store: source,
      product: item.product,
    }),
  ]);
  if (!!receivingInventory && !!issueInventory) {
    // modify quantities and save()handle receiving info
    if (!skipQuantity) {
      receivingInventory.quantity += item.received * item.unit_value;
      issueInventory.quantity -= item.received;
    }

    receivingInventory.receive = incrementInfoRequest(
      receivingInventory.receive,
      item
    );

    // handle issue

    issueInventory.issue = incrementInfoRequest(issueInventory.issue, item);
    await Promise.all([receivingInventory.save(), issueInventory.save()]);
  }
}
