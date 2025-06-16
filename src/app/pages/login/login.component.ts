import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { User } from '../../interfaces/user';

import { UsersStore } from '../../app-stores/users.store';
import { Router, RouterLink } from '@angular/router';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  // shopService = inject(ShopService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  usersStore = inject(UsersStore);
  notification = inject(Notification);
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  ngOnInit(): void {
    this.usersStore.restoreSession();
  }
  async login() {
    this.notification.updateNotification({
      loading: true,
      message: 'logging in..',
    });
    const user: Partial<User> = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
    };
    const status = await this.usersStore.login(user);
    if (!!status) {
      this.notification.reset();
    } else {
      this.notification.updateNotification({
        status: false,
        message: 'could not login...try again',
      });
    }
  }
}
