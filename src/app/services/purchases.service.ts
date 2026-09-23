import { inject, Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { OriginService } from './origin.service';
import {
  DisplayedPurchase,
  IPurchase,
  PurchaseSummary,
} from '../app-stores/purchases.store';
import { DateService } from './date.service';
import { OutletsStore } from '../app-stores/outlet.store';
import { PostResponse } from '../interfaces/post-result';
import { SupplierStore } from '../app-stores/supplier.store';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  origin = inject(OriginService).origin;
  http = inject(HttpService);
  dateService = inject(DateService);
  outletStore = inject(OutletsStore);
  supplierStore = inject(SupplierStore);
  constructor() {}
  async getPurchasesSummary(options: { [key: string]: string | number }) {
    let parsedOptions = '';
    for (let key of Object.keys(options)) {
      parsedOptions += `${key}=${options[key]}&&`;
    }
    const api = `${this.origin}/api/purchases?${parsedOptions}`;
    return this.http.get<PurchaseSummary[]>(api);
  }
  async getStorePurchases(
    storeID: string,
    options: { [key: string]: any } = {}
  ) {
    let parsedOptions = '';
    for (let key of Object.keys(options)) {
      parsedOptions += `${key}=${options[key]}&&`;
    }
    const api = `${this.origin}/api/purchases/store/${storeID}?${parsedOptions}`;
    return this.http.get<IPurchase[]>(api);
  }
  async postPurchase(payload: Partial<IPurchase>) {
    const api = `${this.origin}/api/purchases/create`;
    return this.http
      .post<Partial<IPurchase>, PostResponse<IPurchase>>(api, payload)
      .then((res) => {
        const { result } = res;
        if (!!result) {
          return {
            ...res,
            result: {
              ...result,
              source: this.supplierStore.findStore(result.source).name,
              destination: this.outletStore.findStore(result.destination).name,
            },
          };
        } else return res;
      });
  }
  async receivePurchase({ _id, products }: Partial<IPurchase>) {
    const api = `${this.origin}/api/purchases/receive/${_id}`;
    return this.http.patch<Partial<IPurchase>, PostResponse<IPurchase>>(api, {
      products,
    });
  }

  toDisplayedPurchase(prescription: IPurchase) {
    const { date, time } = this.dateService.parseDate(prescription.createdAt);
    return prescription.products.map((i) => {
      return { ...i, date, time };
    });
  }
  toDisplayedPurchases(prescriptions: IPurchase[]) {
    let cum: DisplayedPurchase[] = [];
    return prescriptions.reduce((cum, curr) => {
      cum.push(...this.toDisplayedPurchase(curr));
      return cum;
    }, cum);
  }
}
