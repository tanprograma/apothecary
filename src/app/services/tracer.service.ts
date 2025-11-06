import { inject, Injectable } from '@angular/core';
import { IStore, OutletsStore } from '../app-stores/outlet.store';
import { PostResponse } from '../interfaces/post-result';
import { HttpService } from './http.service';
import { OriginService } from './origin.service';
import { Notification } from '../app-stores/notification.store';
import { Tracer, TracerReport } from '../interfaces/tracer';

@Injectable({
  providedIn: 'root',
})
export class TracerService {
  origin = inject(OriginService).origin;
  notificationService = inject(Notification);
  outletStore = inject(OutletsStore);
  http = inject(HttpService);
  constructor() {}
  async getTracers() {
    const api = `${this.origin}/api/tracers?store=${
      this.outletStore.selectedStore()?._id
    }`;

    return this.http.get<TracerReport[]>(api);
  }
  async postTracer(payload: {
    value: number;
    created_on: string;
    store: string;
    product: string;
  }) {
    this.notificationService.updateNotification({
      message: 'creating new tracer.',
      loading: true,
    });
    const api = `${this.origin}/api/tracers`;
    const res = await this.http.post<
      Partial<{ value: number; created_on: string }>,
      PostResponse<Tracer>
    >(api, payload);

    return res;
  }
}
