import { Injectable } from '@angular/core';
interface Notification {
  message: string;
  status?: boolean;
  loading: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notification: Notification = {
    message: '',
    loading: false,
  };
  constructor() {}
  updateNotification(payload: Partial<Notification>) {
    this.notification = { ...this.notification, ...payload };
  }
  reset() {
    this.notification = {
      message: '',
      status: undefined,
      loading: false,
    };
  }
}
