import { inject, Injectable } from '@angular/core';
import { Expiry } from '../app-stores/expiry.store';
import { PostResponse } from '../interfaces/post-result';
import { HttpService } from './http.service';
import { OriginService } from './origin.service';
import { Product } from '../interfaces/product';
import { IStore } from '../app-stores/outlet.store';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ExpiryService {
  origin = inject(OriginService).origin;
  http = inject(HttpService);

  constructor() {}

  async postExpiry(payload: Partial<Expiry<string, string>>) {
    const api = `${this.origin}/api/expiry/create`;
    return this.http.post<
      Partial<Expiry<string, string>>,
      PostResponse<Expiry<string, string>>
    >(api, payload);
  }
  async getExpiry(storeID?: string) {
    const api = !!storeID
      ? `${this.origin}/api/expiry?storeID=${storeID}`
      : `${this.origin}/api/expiry`;
    return this.http.get<Expiry<string, string>[]>(api);
  }
}
