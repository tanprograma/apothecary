import { Schema, model } from 'mongoose';
import { Inventory } from '../../src/app/interfaces/inventory';
import { AnyARecord } from 'node:dns';
const priceSchema = new Schema<{ unit: string; value: number }>(
  {
    unit: String,
    value: Number,
  },
  { _id: false }
);
const schema = new Schema<Inventory>({
  store: String,
  product: String,
  prices: [priceSchema],
  quantity: Number,
  expiry: String,
});
export const InventoryModel = model('Inventories', schema);
export async function sell(item: any, store: any) {
  const sale = await InventoryModel.findOne({
    store: store,
    product: item.product,
  });
  if (!!sale) {
    sale.quantity -= item.quantity;
    await sale.save();
  }
}
export async function purchase(item: any, store: any) {
  const sale = await InventoryModel.findOne({
    store: store,
    product: item.product,
  });
  if (!!sale) {
    sale.quantity += item.received;
    await sale.save();
  }
}
export async function issue(item: any, source: any, destination: any) {
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
    // modify quantities and save()
    receivingInventory.quantity += item.received;
    issueInventory.quantity -= item.received;
    await Promise.all([receivingInventory.save(), issueInventory.save()]);
  }
}
