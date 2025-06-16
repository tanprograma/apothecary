import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../interfaces/user';
import { PostResponse } from '../interfaces/post-result';
import { HttpService } from './http.service';

import { OriginService } from './origin.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Notification } from '../app-stores/notification.store';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  origin = inject(OriginService).origin;
  router = inject(Router);
  http = inject(HttpService);
  appID = inject(PLATFORM_ID);
  notificationStore = inject(Notification);
  constructor() {}
  async getUsers() {
    const api = `${this.origin}/api/users`;
    return this.http.get<User[]>(api);
  }
  async postUser(payload: Partial<User>) {
    this.notificationStore.updateNotification({
      message: 'creating new user',
      loading: true,
    });
    const api = `${this.origin}/api/users/create`;
    const res = await this.http.post<Partial<User>, PostResponse<User>>(
      api,
      payload
    );
    if (!!res.status) {
      this.notificationStore.updateNotification({
        status: true,
        message: 'User created successfully',
      });
    } else {
      this.notificationStore.updateNotification({
        status: false,
        message: 'User creation failed',
      });
    }
    return res;
  }
  async login(payload: Partial<User>) {
    this.notificationStore.updateNotification({
      message: 'logging in..',
      loading: true,
    });
    const api = `${this.origin}/api/users/login`;
    const res = await this.http.post<Partial<User>, PostResponse<User>>(
      api,
      payload
    );
    if (!!res.status) {
      this.notificationStore.reset();
    } else {
      this.notificationStore.updateNotification({
        status: false,
        message: 'login failed',
      });
    }
    return res;
  }
  getSession(): { status: boolean; user?: Partial<User> } {
    if (isPlatformBrowser(this.appID)) {
      // const store = sessionStorage.getItem('store');
      const user = sessionStorage.getItem('user');
      if (!!user) {
        return { status: true, user: JSON.parse(user) };
      }
    }
    return { status: false };
  }
  setSession(user: Partial<User>) {
    if (isPlatformBrowser(this.appID)) {
      // const store = sessionStorage.getItem('store');
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }
  clearSession() {
    if (isPlatformBrowser(this.appID)) {
      // const store = sessionStorage.getItem('store');
      sessionStorage.clear();
    }
  }
}
