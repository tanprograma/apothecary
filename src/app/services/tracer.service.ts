import { inject, Injectable } from '@angular/core';
import { IStore, OutletsStore } from '../app-stores/outlet.store';
import { PostResponse } from '../interfaces/post-result';
import { HttpService } from './http.service';
import { OriginService } from './origin.service';
import { Notification } from '../app-stores/notification.store';
import { Tracer, TracerReport } from '../interfaces/tracer';
import { IInventory } from '../app-stores/inventory.store';
import { Product } from '../interfaces/product';

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
  async getTracer(tracerID: string) {
    const api = `${this.origin}/api/tracers/find?store=${
      this.outletStore.selectedStore()?._id
    }&&tracerID=${tracerID}`;

    return this.http.get<TracerReport>(api);
  }
  async postTracer(payload: Partial<IInventory<Product, IStore>>) {
    this.notificationService.updateNotification({
      message: 'creating new tracer.',
      loading: true,
    });
    const api = `${this.origin}/api/tracers`;
    const res = await this.http.post<
      Partial<IInventory<Product, IStore>>,
      PostResponse<{ _id: string; tracer: number }>
    >(api, payload);

    return res;
  }
  async postTracerDate(payload: Partial<IStore>) {
    this.notificationService.updateNotification({
      message: 'creating new tracer.',
      loading: true,
    });
    const api = `${this.origin}/api/tracers/date`;
    const { status, result } = await this.http.patch<
      Partial<IStore>,
      PostResponse<Partial<IStore>>
    >(api, payload);
    if (!!status) {
      this.outletStore.setTracerDate(result as Partial<IStore>);
    }
    return status;
  }
}
