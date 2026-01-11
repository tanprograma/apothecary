import { stat } from 'fs';

import { Request, Response } from 'express';
import { RequestModel } from '../models/request';
import { TracerReport, Tracer } from '../../src/app/interfaces/tracer';
import { ProductModel } from '../models/product';
import { InventoryModel } from '../models/inventory';
import { SaleModel } from '../models/sale';
import { PurchaseModel } from '../models/purchase';
import { StoreModel } from '../models/store';

export const postTracersDate = async (req: Request, res: Response) => {
  try {
    const { name, stock_taking } = req.body;
    const store_req = await StoreModel.findOne({ name });
    if (!!store_req) {
      store_req['stock_taking'] = stock_taking;
      const store = await store_req.save();
      res.status(200).json({ result: store, status: true });
    } else {
      res.status(500).json({ status: false });
    }
  } catch (error) {
    res.status(500).json({ status: false });
  }
};
export const getTracers = async (req: Request, res: Response) => {
  try {
    const { store } = req.query;
    const [tracers, products, __store] = await Promise.all([
      InventoryModel.find({ store, tracer: { $ne: null } }),

      ProductModel.find(),
      StoreModel.findOne({ _id: store }),
    ]);
    const mappedTracers = tracers.reduce((sum, tracer) => {
      sum[tracer.product] = {
        product: tracer.product,
        store: tracer.store,
        quantity: tracer.tracer ?? 0,
        tracerID: tracer._id,
        available: tracer.quantity,

        dispensed: 0,
        issued: 0,
        received: 0,
        purchased: 0,
      };
      return sum;
    }, {} as { [key: string]: TracerReport });
    const tracerReports = await generateTracerReports(
      mappedTracers,
      products,
      store as string,
      __store?.stock_taking as string
    );

    res.status(200).json(tracerReports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
export const getTracer = async (req: Request, res: Response) => {
  try {
    const { store, tracerID } = req.query;
    const [tracers, products, __store] = await Promise.all([
      InventoryModel.find({ _id: tracerID }),

      ProductModel.find(),
      StoreModel.findOne({ _id: store }),
    ]);
    const mappedTracers = tracers.reduce((sum, tracer) => {
      sum[tracer.product] = {
        product: tracer.product,
        store: '',
        quantity: tracer.tracer ?? 0,

        available: tracer.quantity,
        tracerID: tracer._id,

        dispensed: 0,
        issued: 0,
        received: 0,
        purchased: 0,
      };
      return sum;
    }, {} as { [key: string]: TracerReport });
    const tracerReports = await generateTracerReports(
      mappedTracers,
      products,
      store as string,
      __store?.stock_taking as string
    );

    res.status(200).json(tracerReports[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
export const createTracer = async (req: Request, res: Response) => {
  const { tracer, _id } = req.body;
  try {
    const newTracer = await InventoryModel.findOne({ _id });

    if (!!newTracer) {
      newTracer.tracer = tracer;

      const saved = await newTracer.save();
      // creates a new tracer

      // returns the new Tracer
      res.status(201).json({
        result: { tracer: saved.tracer, _id: saved._id },
        status: true,
      });
    } else {
      res.status(201).json({ status: false });
    }
  } catch (error) {
    res.status(500).json({ status: false });
  }
};
export function tracerMapper(
  tracer: TracerReport,
  products: any[]
): TracerReport {
  const product = products.find((p) => p._id.toString() === tracer.product);
  return {
    ...tracer,
    product: product ? product.name : 'Unknown',
  };
}

export async function generateTracerReports(
  tracerContainer: { [key: string]: TracerReport },
  products: any[],
  store: string,
  created_on: string
): Promise<TracerReport[]> {
  const [purchasedItems, receivedItems, issuedItems, dispensedItems] =
    await Promise.all([
      PurchaseModel.find({
        destination: store,

        completed: true,
        createdAt: { $gte: created_on },
      }),
      RequestModel.find({
        destination: store,

        completed: true,
        createdAt: { $gte: created_on },
      }),
      RequestModel.find({
        source: store,

        completed: true,
        createdAt: { $gte: created_on },
      }),
      SaleModel.find({
        store: store,

        createdAt: { $gte: created_on },
      }),
    ]);
  tracerContainer = purchasedItems.reduce((sum, request: any) => {
    // increments purchased value of items in the container
    for (let item of request['products']) {
      if (!!sum[item.product]) {
        sum[item.product].purchased =
          sum[item.product].purchased + item.received * item.unit_value;
      }
    }
    return sum;
  }, tracerContainer);
  tracerContainer = issuedItems.reduce((sum, request: any) => {
    // increments purchased value of items in the container
    for (let item of request['products']) {
      if (!!sum[item.product]) {
        sum[item.product].issued =
          sum[item.product].issued + item.received * item.unit_value;
      }
    }
    return sum;
  }, tracerContainer);
  tracerContainer = dispensedItems.reduce((sum, request) => {
    // increments purchased value of items in the container
    for (let item of request.products) {
      if (!!sum[item.product as string]) {
        sum[item.product as string].dispensed =
          sum[item.product as string].dispensed +
          item.quantity * item.unit_value;
      }
    }
    return sum;
  }, tracerContainer);

  tracerContainer = receivedItems.reduce((sum, request: any) => {
    // increments purchased value of items in the container
    for (let item of request.products) {
      if (!!sum[item.product]) {
        sum[item.product].received =
          sum[item.product].received + item.received * item.unit_value;
      }
    }
    return sum;
  }, tracerContainer);

  return Object.values(tracerContainer).map((tracer) => ({
    ...tracer,
    product: products.find((p) => p._id.toString() === tracer.product).name,
  }));
  // return {
  //   ...tracer,
  //   product: products.find((p) => p._id.toString() === tracer.product).name,
  //   issued,
  //   dispensed,
  //   received,
  //   purchased,
  // };
}
