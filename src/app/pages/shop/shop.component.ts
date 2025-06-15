import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { OutletsStore } from '../../app-stores/outlet.store';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { SaleStore } from '../../app-stores/sale.store';
import { DropdownLinksComponent } from '../../components/dropdown-links/dropdown-links.component';
import { SupplierStore } from '../../app-stores/supplier.store';
import { UsersStore } from '../../app-stores/users.store';

@Component({
  selector: 'shop',
  imports: [RouterOutlet, DropdownLinksComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  route = inject(ActivatedRoute);
  outletStore = inject(OutletsStore);
  supplierStore = inject(SupplierStore);
  inventoryStore = inject(InventoriesStore);
  userStore = inject(UsersStore);
  salesStore = inject(SaleStore);
  ngOnInit(): void {
    this.initializeStore();
  }
  initializeStore() {
    if (this.authenticate()) {
      this.setSelectedStore();
      this.getResources();
    } else {
      this.userStore.routeToLogin();
    }
  }
  setSelectedStore() {
    const name = this.route.snapshot.paramMap.get('name') as string;
    const id = this.route.snapshot.paramMap.get('id') as string;
    this.outletStore.setSelectedStore({ name, _id: id });
  }
  getResources() {
    Promise.all([
      this.inventoryStore.getInventory(this.outletStore.selectedStore()?._id),
      this.outletStore.getStores(),
      this.supplierStore.getStores(),
    ]).then((res) => console.log('initialized resources'));
  }
  authenticate() {
    return this.userStore.authenticated();
  }
}
