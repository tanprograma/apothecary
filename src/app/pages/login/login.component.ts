import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { User } from '../../interfaces/user';
import { Store } from '../../interfaces/store';
import { isPlatformBrowser } from '@angular/common';
import { UsersStore } from '../../app-stores/users.store';
import { Router, RouterLink } from '@angular/router';

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
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  ngOnInit(): void {
    this.usersStore.restoreSession();
  }
  async login() {
    const user: Partial<User> = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
    };
    return this.usersStore.login(user);
  }
}
