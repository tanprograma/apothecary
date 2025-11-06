import { stat } from 'fs';

import { Request, Response } from 'express';
import { RequestModel } from '../models/request';
import { TracerReport, Tracer } from '../../src/app/interfaces/tracer';
import { ProductModel } from '../models/product';
import { InventoryModel } from '../models/inventory';
import { SaleModel } from '../models/sale';

export const getTracers = async (req: Request, res: Response) => {
  try {
    const { store } = req.query;
    const [tracers, products] = await Promise.all([
      InventoryModel.find({ store, tracer: { $ne: null } }),

      ProductModel.find(),
    ]);
    const mappedTracers = tracers.map((tracer) => ({
      product: tracer.product,
      store: tracer.store,
      quantity: tracer.tracer as number,

      available: tracer.quantity,

      created_on: tracer.created_on as string,
    }));
    const tracerReports = await generateTracerReports(mappedTracers, products);

    res.status(200).json(tracerReports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
export const createTracer = async (req: Request, res: Response) => {
  const { store, product, created_on, value } = req.body;
  try {
    const newTracer = await InventoryModel.findOne({ store, product });
    if (!!newTracer) {
      newTracer.tracer = value;
      newTracer.created_on = created_on;
      await newTracer.save();
      res.status(201).json({ result: newTracer, status: true });
      return;
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
  tracers: Tracer[],
  products: any[]
): Promise<TracerReport[]> {
  return Promise.all(
    tracers.map(async (tracer) => {
      const [receivedItems, issuedItems, dispensedItems] = await Promise.all([
        RequestModel.find({
          destination: tracer.store,
          completed: true,
          createdAt: { $gte: tracer.created_on },
        }),
        RequestModel.find({
          source: tracer.store,
          completed: true,
          createdAt: { $gte: tracer.created_on },
        }),
        SaleModel.find({
          store: tracer.store,
          createdAt: { $gte: tracer.created_on },
        }),
      ]);

      const issued = issuedItems.reduce((sum, request) => {
        const item = request.products.find((p) => p.product === tracer.product);
        return sum + (item ? item.received * item.unit_value : 0);
      }, 0);
      const dispensed =
        dispensedItems.reduce((sum, request) => {
          const item = request.products.find(
            (p) => p.product === tracer.product
          );
          return sum + (item ? item.quantity * item.unit_value : 0);
        }, 0) || 0;

      const received = receivedItems.reduce((sum, request) => {
        const item = request.products.find((p) => p.product === tracer.product);
        return sum + (item ? item.received * item.unit_value : 0);
      }, 0);

      return {
        ...tracer,
        product: products.find((p) => p._id.toString() === tracer.product).name,
        issued,
        dispensed,
        received,
      };
    })
  );
}
