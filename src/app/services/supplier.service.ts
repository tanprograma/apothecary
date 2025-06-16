import { inject, Injectable } from '@angular/core';

import { HttpService } from './http.service';
import { OriginService } from './origin.service';
import { ISupplier } from '../app-stores/supplier.store';

import { PostResponse } from '../interfaces/post-result';
import { Notification } from '../app-stores/notification.store';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  origin = inject(OriginService).origin;
  http = inject(HttpService);
  notificationService = inject(Notification);
  constructor() {}
  async getStores() {
    const api = `${this.origin}/api/suppliers`;
    return this.http.get<ISupplier[]>(api);
  }
  async postStore(payload: Partial<ISupplier>) {
    this.notificationService.updateNotification({
      message: 'creating new store',
      loading: true,
    });
    const api = `${this.origin}/api/suppliers/create`;
    const res = await this.http.post<
      Partial<ISupplier>,
      PostResponse<ISupplier>
    >(api, payload);
    if (!!res.status) {
      this.notificationService.updateNotification({
        status: true,
        message: 'store created successfully',
      });
    } else {
      this.notificationService.updateNotification({
        status: false,
        message: 'store creation failed',
      });
    }
    return res;
  }
}
