import { inject, Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { PostResponse } from '../interfaces/post-result';
import { HttpService } from './http.service';

import { OriginService } from './origin.service';
import { Notification } from '../app-stores/notification.store';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  origin = inject(OriginService).origin;
  http = inject(HttpService);
  notificationService = inject(Notification);
  constructor() {}
  async getProducts() {
    const api = `${this.origin}/api/products`;
    return this.http.get<Product[]>(api);
  }
  async postProduct(payload: Partial<Product>) {
    this.notificationService.updateNotification({
      message: 'creating new store',
      loading: true,
    });
    const api = `${this.origin}/api/products/create`;
    const res = await this.http.post<Partial<Product>, PostResponse<Product>>(
      api,
      payload
    );
    if (!!res.status) {
      this.notificationService.updateNotification({
        status: true,
        message: 'product created successfully',
      });
    } else {
      this.notificationService.updateNotification({
        status: false,
        message: 'product creation failed',
      });
    }
    return res;
  }
}
