import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './components/user/user.component';

import { JsonPipe } from '@angular/common';

import { AllertLoadingComponent } from './components/allert-loading/allert-loading.component';

import { AllertFailureComponent } from './components/allert-failure/allert-failure.component';
import { AllertSuccessComponent } from './components/allert-success/allert-success.component';

import { UsersStore } from './app-stores/users.store';
import { Notification } from './app-stores/notification.store';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    UserComponent,
    JsonPipe,
    AllertLoadingComponent,

    AllertFailureComponent,
    AllertSuccessComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'apothecary';

  notificationStore = inject(Notification);
  userStore = inject(UsersStore);
  ngOnInit(): void {
    this.userStore.restoreSession();
  }
}
