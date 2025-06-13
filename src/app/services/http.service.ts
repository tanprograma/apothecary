import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor() {}
  async get<Response>(api: string): Promise<Response> {
    const req = await fetch(api);
    const res = await req.json();
    return res;
  }
  async post<Payload, Response>(api: string, data: Payload): Promise<Response> {
    const req = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const res = await req.json();
    return res;
  }
  async patch<Payload, Response>(
    api: string,
    data: Payload
  ): Promise<Response> {
    const req = await fetch(api, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const res = await req.json();
    return res;
  }
}
