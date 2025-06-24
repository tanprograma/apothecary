import { inject, Injectable } from '@angular/core';
import { OriginService } from './origin.service';
import { HttpService } from './http.service';
import { SalesSummary } from '../app-stores/statistics.store';
import { FormBuilder, Validators } from '@angular/forms';
import { DisplayedSale, ISale, ISaleItem } from '../app-stores/sale.store';
import { IInventory } from '../app-stores/inventory.store';
import { Product } from '../interfaces/product';
import { IStore } from '../app-stores/outlet.store';
import { PostResponse } from '../interfaces/post-result';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  dateService = inject(DateService);
  origin = inject(OriginService).origin;
  http = inject(HttpService);

  constructor() {}
  // sale form api
  addToCart(inventories: IInventory<Product, IStore>[]) {}
  parseTime(time: string) {
    const date = new Date(time);
    return `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  getUnitValue() {}
  async getSalesSummary(options: { [key: string]: string | number }) {
    let parsedOptions = '';
    for (let key of Object.keys(options)) {
      parsedOptions += `${key}=${options[key]}&&`;
    }
    const api = `${this.origin}/api/sales?${parsedOptions}`;
    return this.http.get<SalesSummary[]>(api);
  }
  async postSale(payload: Partial<ISale>) {
    const api = `${this.origin}/api/sales/create`;
    return this.http.post<Partial<ISale>, PostResponse<ISale>>(api, payload);
  }
  async getStoreSales(storeID: string, options: { [key: string]: any } = {}) {
    let parsedOptions = '';
    for (let key of Object.keys(options)) {
      // excludes store id
      if (key != 'storeID') {
        parsedOptions += `${key}=${options[key]}&&`;
      }
    }
    const api = `${this.origin}/api/sales/store/${storeID}?${parsedOptions}`;
    return this.http.get<ISale[]>(api);
  }
  async getReport(options: { [key: string]: any } = {}) {
    // gets the summarized report
    let parsedOptions = '';
    for (let key of Object.keys(options)) {
      // excludes store id

      parsedOptions += `${key}=${options[key]}&&`;
    }
    const api = `${this.origin}/api/sales/report?${parsedOptions}`;
    return this.http.get<SalesSummary[]>(api);
  }
  toDisplayedSale(prescription: ISale) {
    const { date, time } = this.dateService.parseDate(prescription.createdAt);
    return prescription.products.map((i) => {
      return { ...i, date, time };
    });
  }
  toDisplayedSales(prescriptions: ISale[]) {
    let cum: DisplayedSale[] = [];
    return prescriptions.reduce((cum, curr) => {
      cum.push(...this.toDisplayedSale(curr));
      return cum;
    }, cum);
  }
}
