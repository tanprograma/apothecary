import { Schema, model } from 'mongoose';
import { Unit } from '../../src/app/interfaces/unit';
import { Info } from '../../src/app/app-stores/inventory.store';
const schema = new Schema<Info>({
  category: String,
  items: { type: Number, default: () => 0 },
  orders: { type: Number, default: () => 0 },
  amount: { type: Number, default: () => 0 },
});
export const InfoModel = model('Info', schema);
export async function addSaleInfo(item: any) {
  const info = await InfoModel.findOne({
    category: 'sales',
  });
  if (!!info) {
    // work on infos info
    info.items += item.products.length;
    info.amount += reducedAmount(item.products);
    info.orders += 1;
    await info.save();
  }
}
export async function addPurchaseInfo(item: any) {
  const info = await InfoModel.findOne({
    category: 'purchases',
  });
  if (!!info) {
    // work on infos info
    info.items += item.products.length;
    info.amount += reducedAmount(item.products);
    info.orders += 1;
    await info.save();
  }
}
export async function addReceiveInfo(item: any) {
  const info = await InfoModel.findOne({
    category: 'receive',
  });
  if (!!info) {
    // work on infos info
    info.items += item.products.length;
    info.amount += reducedAmount(item.products);
    info.orders += 1;
    await info.save();
  }
}
export async function addIssueInfo(item: any) {
  const info = await InfoModel.findOne({
    category: 'issue',
  });
  if (!!info) {
    // work on infos info
    info.items += item.products.length;
    info.amount += reducedAmount(item.products);
    info.orders += 1;
    await info.save();
  }
}
function reducedAmount(transactionItems: any[]) {
  return transactionItems.reduce((cum: number, item: any) => {
    cum += item.price * item.quantity;
    return cum;
  }, 0);
}
