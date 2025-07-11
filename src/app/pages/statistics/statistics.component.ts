import { Component, inject } from '@angular/core';
import { UsersStore } from '../../app-stores/users.store';
import { DropdownLinksComponent } from '../../components/dropdown-links/dropdown-links.component';
import { RouterOutlet } from '@angular/router';
import { OutletsStore } from '../../app-stores/outlet.store';

@Component({
  selector: 'statistics',
  imports: [DropdownLinksComponent, RouterOutlet],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  userStore = inject(UsersStore);
  outletStore = inject(OutletsStore);
  // storeConfig = this.shopService.storeConfig;
  // storeLinks: { url: string; name: string }[] = [];
  statisticsLinks: { name: string; url: string }[] = [
    // { name: 'summary', url: '/home/summary-statistics' },
    { name: 'sales', url: '/statistics/sales' },
    { name: 'purchases', url: '/statistics/purchases' },
    { name: 'inventories', url: '/statistics/inventories' },
  ];
  ngOnInit(): void {
    if (!this.authenticated()) {
      this.userStore.routeToLogin();
    } else {
      this.getStores();
    }
  }

  isAdmin() {
    return true;
    // return (this.shopService.getCurrentUser() as User).role == 'admin';
  }

  authenticated() {
    return this.userStore.authenticated();
  }
  getStores() {
    this.outletStore
      .getStores()
      .then(() => {})
      .catch((err) => {
        console.log(err.message);
      });
  }
}
