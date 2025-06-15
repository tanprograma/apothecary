import { inject, Injectable } from '@angular/core';
import {
  IInventory,
  Info,
  InfoSummary,
  InventorySummary,
} from '../app-stores/inventory.store';
import { HttpService } from './http.service';
import { OriginService } from './origin.service';
import { IStore } from '../app-stores/outlet.store';
import { Product } from '../interfaces/product';
import { PostResponse } from '../interfaces/post-result';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  origin = inject(OriginService).origin;
  http = inject(HttpService);
  constructor() {}
  async getInventoriesSummary(options: { [key: string]: string | number }) {
    let parsedOptions = '';
    for (let key of Object.keys(options)) {
      parsedOptions += `${key}=${options[key]}&&`;
    }
    const api = `${this.origin}/api/inventories?${parsedOptions}`;
    return this.http.get<InventorySummary[]>(api);
  }

  async getInfo() {
    // let parsedOptions = '';
    // for (let key of Object.keys(options)) {
    //   parsedOptions += `${key}=${options[key]}&&`;
    // }
    const api = `${this.origin}/api/info`;
    return this.http.get<Info[]>(api);
  }

  async getInventory(storeID: string) {
    const api = `${this.origin}/api/inventories/store/${storeID}`;
    return this.http.get<IInventory<Product, IStore>[]>(api);
  }
  async updateExpiry(payload: Partial<IInventory<Product, IStore>>) {
    const api = `${this.origin}/api/inventories/update-expiry`;
    return this.http.patch<
      Partial<IInventory<Product, IStore>>,
      PostResponse<boolean>
    >(api, payload);
  }
  async updateQuantity(payload: Partial<IInventory<Product, IStore>>) {
    const api = `${this.origin}/api/inventories/update-quantity`;
    return this.http.patch<
      Partial<IInventory<Product, IStore>>,
      PostResponse<boolean>
    >(api, payload);
  }
  async updatePrice(payload: {
    _id: string;
    price: { unit: string; value: number };
  }) {
    const api = `${this.origin}/api/inventories/update-quantity`;
    return this.http.patch<
      {
        _id: string;
        price: { unit: string; value: number };
      },
      PostResponse<boolean>
    >(api, payload);
  }
}
