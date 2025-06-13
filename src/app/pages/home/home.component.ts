import { Component, inject, OnInit } from '@angular/core';

import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { DropdownLinksComponent } from '../../components/dropdown-links/dropdown-links.component';
import { User } from '../../interfaces/user';
import { OutletsStore } from '../../app-stores/outlet.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, DropdownLinksComponent, RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  outletStore = inject(OutletsStore);
  // storeConfig = this.shopService.storeConfig;
  // storeLinks: { url: string; name: string }[] = [];
  statisticsLinks: { name: string; url: string }[] = [
    // { name: 'summary', url: '/home/summary-statistics' },
    { name: 'sales', url: '/home/sales-statistics' },
    { name: 'purchases', url: '/home/purchases-statistics' },
    { name: 'inventories', url: '/home/inventory-statistics' },
  ];
  ngOnInit(): void {
    // if (this.shopService.getCurrentUser() != undefined) {
    //   this.configureStoreLinks();
    // } else {
    //   this.shopService.logOut();
    // }
    this.getStores().then((_) => {});
  }

  isAdmin() {
    return true;
    // return (this.shopService.getCurrentUser() as User).role == 'admin';
  }
  async getStores() {
    await this.outletStore.getStores();
  }
}
