import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DropdownLinksComponent } from '../../components/dropdown-links/dropdown-links.component';
import { OutletsStore } from '../../app-stores/outlet.store';
import { UsersStore } from '../../app-stores/users.store';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, DropdownLinksComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  userStore = inject(UsersStore);
  outletStore = inject(OutletsStore);
  appLinks = [
    { url: '/admin', name: 'admin' },
    { url: '/home', name: 'home' },
  ];

  ngOnInit(): void {
    if (!this.authenticate()) {
      this.userStore.routeToLogin();
    }
  }
  authenticate() {
    return this.userStore.authenticated();
  }
}
