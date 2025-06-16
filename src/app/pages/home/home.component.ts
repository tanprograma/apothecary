import { Component, inject, OnInit } from '@angular/core';

import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { DropdownLinksComponent } from '../../components/dropdown-links/dropdown-links.component';
import { User } from '../../interfaces/user';
import { OutletsStore } from '../../app-stores/outlet.store';
import { UsersStore } from '../../app-stores/users.store';

import { InventoriesStore } from '../../app-stores/inventory.store';
import { HomeInfoComponent } from '../../components/home-info/home-info.component';
import { Notification } from '../../app-stores/notification.store';
import { trusted } from 'mongoose';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, DropdownLinksComponent, HomeInfoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  outletStore = inject(OutletsStore);
  inventoryStore = inject(InventoriesStore);
  userStore = inject(UsersStore);
  notificationStore = inject(Notification);

  ngOnInit(): void {
    if (this.authenticate()) {
      this.initialize().then((_) => console.log('home initialized'));
    } else {
      this.userStore.routeToLogin();
    }
  }

  isAdmin() {
    return true;
    // return (this.shopService.getCurrentUser() as User).role == 'admin';
  }
  async initialize() {
    this.notificationStore.updateNotification({
      message: 'initializing the app',
      loading: true,
    });
    await Promise.all([
      this.outletStore.getStores(),
      this.inventoryStore.getInfoSummary(),
    ]);
    this.notificationStore.reset();
  }
  authenticate() {
    return this.userStore.authenticated();
  }
}
