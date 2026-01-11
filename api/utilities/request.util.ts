import { IRequestItem } from '../../src/app/app-stores/transfers.store';

class Summary {
  [product: string]: IRequestItem;
}
export class RequestUtil {
  constructor(private DB: { prescriptions: any[] }) {}
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
    return this.DB.prescriptions.map((prescription) => {
      return this.mapPrescription(prescription);
    });
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
  private mapSummary(summary: Summary) {
    return Object.values(summary).map((item) => {
      return {
        ...item,
        requested: Math.ceil(item.requested / item.unit_value),
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
  }
  private createSummaryContainer() {
    const summary = new Summary();

    return summary;
  }
  private findLargestUnit(units: any[]) {
    return units.sort((a: any, b: any) => {
      if (a.value > b.value) return -1;
      if (a.value < b.value) return 1;
      return 0;
    })[0];
  }
  static async find(models: { RequestModel: any }, query: any) {
    const parsedQuery = RequestUtil.createDateQuery(query);
    const findOptions = !!query.store
      ? {
          ...parsedQuery,
          $or: [{ source: query.store }, { destination: query.store }],
        }
      : parsedQuery;
    const prescriptions = !!query.limit
      ? await models.RequestModel.find(findOptions)
          .sort({ createdAt: -1 })
          .populate([
            { path: 'source' },
            { path: 'destination' },
            { path: 'products.product' },
          ])
          .limit(parseInt(query.limit))
      : await models.RequestModel.find(findOptions)
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
