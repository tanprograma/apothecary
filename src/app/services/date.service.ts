import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}
  parseDate(time?: string | number): { date: string; time: string } {
    if (!!time) {
      const date = new Date(time);
      return {
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
        time: ` ${date.toLocaleTimeString()}`,
      };
    }
    return { date: 'unknown', time: 'unknown' };
  }
}
