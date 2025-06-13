import { inject, Injectable } from '@angular/core';
import { OriginService } from './origin.service';
import { HttpService } from './http.service';
import { Log } from '../app-stores/logs.store';
import { PostResponse } from '../interfaces/post-result';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor() {}
  origin = inject(OriginService).origin;
  http = inject(HttpService);
  log(message: string) {
    console.log(message);
  }
  async getLogs() {
    const api = `${this.origin}/api/logs`;
    return this.http.get<Log[]>(api);
  }
  async serverLog(log: Partial<Log>) {
    const api = `${this.origin}/api/logs/create`;
    return this.http.post<Partial<Log>, PostResponse<Log>>(api, log);
  }
}
