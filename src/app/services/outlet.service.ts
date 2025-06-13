import { inject, Injectable } from '@angular/core';
import { IStore } from '../app-stores/outlet.store';
import { HttpService } from './http.service';
import { OriginService } from './origin.service';
import { PostResponse } from '../interfaces/post-result';

import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class OutletService {
  origin = inject(OriginService).origin;
  notificationService = inject(NotificationService);
  http = inject(HttpService);
  constructor() {}
  async getStores() {
    const api = `${this.origin}/api/stores`;
    return this.http.get<IStore[]>(api);
  }
  async postStore(payload: Partial<IStore>) {
    this.notificationService.updateNotification({
      message: 'creating new store',
      loading: true,
    });
    const api = `${this.origin}/api/stores/create`;
    const res = await this.http.post<Partial<IStore>, PostResponse<IStore>>(
      api,
      payload
    );
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
