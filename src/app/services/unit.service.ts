import { inject, Injectable } from '@angular/core';
import { Unit } from '../interfaces/unit';
import { PostResponse } from '../interfaces/post-result';
import { HttpService } from './http.service';
import { NotificationService } from './notification.service';
import { OriginService } from './origin.service';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  origin = inject(OriginService).origin;
  http = inject(HttpService);
  notificationService = inject(NotificationService);
  constructor() {}
  async getUnits() {
    const api = `${this.origin}/api/units`;
    return this.http.get<Unit[]>(api);
  }
  async postUnit(payload: Partial<Unit>) {
    this.notificationService.updateNotification({
      message: 'creating new store',
      loading: true,
    });
    const api = `${this.origin}/api/units/create`;
    const res = await this.http.post<Partial<Unit>, PostResponse<Unit>>(
      api,
      payload
    );
    if (!!res.status) {
      this.notificationService.updateNotification({
        status: true,
        message: 'unit created successfully',
      });
    } else {
      this.notificationService.updateNotification({
        status: false,
        message: 'unit creation failed',
      });
    }
    return res;
  }
}
