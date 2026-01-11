import { inject, Injectable } from '@angular/core';
import {
  DisplayedRequest,
  IRequest,
  RequestSummary,
} from '../app-stores/transfers.store';
import { PostResponse } from '../interfaces/post-result';
import { HttpService } from './http.service';
import { OriginService } from './origin.service';
import { DateService } from './date.service';
import { OutletsStore } from '../app-stores/outlet.store';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  dateService = inject(DateService);
  origin = inject(OriginService).origin;
  http = inject(HttpService);
  outletStore = inject(OutletsStore);

  constructor() {}
  // sale form api

  async getRequestsQuery(start: string, end: string) {
    const api = `${this.origin}/api/requests/query?start=${start}&&end=${end}`;

    return this.http.get<IRequest[]>(api);
  }
  async getRequestSummary(options: { [key: string]: string | number }) {
    let parsedOptions = '';
    for (let key of Object.keys(options)) {
      parsedOptions += `${key}=${options[key]}&&`;
    }
    const api = `${this.origin}/api/requests?${parsedOptions}`;
    return this.http.get<RequestSummary[]>(api);
  }
  async postRequest(payload: Partial<IRequest>) {
    const api = `${this.origin}/api/requests/create`;
    return this.http
      .post<Partial<IRequest>, PostResponse<IRequest>>(api, payload)
      .then((res) => {
        const { result } = res;
        if (!!result) {
          return {
            ...res,
            result: {
              ...result,
              source: this.outletStore.findStore(result.source).name,
              destination: this.outletStore.findStore(result.destination).name,
            },
          };
        } else return res;
      });
  }
  async issueRequest({ _id, products }: Partial<IRequest>) {
    const api = `${this.origin}/api/requests/issue/${_id}`;
    return this.http.patch<Partial<IRequest>, PostResponse<IRequest>>(api, {
      products,
    });
  }
  async getStoreRequests(
    storeID: string,
    options: { [key: string]: any } = {}
  ) {
    let parsedOptions = '';
    for (let key of Object.keys(options)) {
      parsedOptions += `${key}=${options[key]}&&`;
    }
    const api = `${this.origin}/api/requests/store/${storeID}?${parsedOptions}`;
    return this.http.get<IRequest[]>(api);
  }
  toDisplayedRequest(prescription: IRequest) {
    const { date, time } = this.dateService.parseDate(prescription.createdAt);
    return prescription.products.map((i) => {
      return { ...i, date, time };
    });
  }
  toDisplayedRequests(prescriptions: IRequest[]) {
    let cum: DisplayedRequest[] = [];
    return prescriptions.reduce((cum, curr) => {
      cum.push(...this.toDisplayedRequest(curr));
      return cum;
    }, cum);
  }
}
