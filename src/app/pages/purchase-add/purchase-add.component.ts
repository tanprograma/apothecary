import { Component, inject } from '@angular/core';
import { OutletsStore } from '../../app-stores/outlet.store';
import { PurchasesStore } from '../../app-stores/purchases.store';
import { SupplierStore } from '../../app-stores/supplier.store';
import { PurchaseFormComponent } from '../../components/purchase-form/purchase-form.component';
import { PurchaseReceiveComponent } from '../../components/purchase-receive/purchase-receive.component';
import { PurchaseViewComponent } from '../../components/purchase-view/purchase-view.component';
import { Notification } from '../../app-stores/notification.store';
import { PurchaseFormMigrateComponent } from '../../components/purchase-form-migrate/purchase-form-migrate.component';

@Component({
  selector: 'purchase-add',
  imports: [
    PurchaseFormMigrateComponent,
    PurchaseReceiveComponent,
    PurchaseViewComponent,
  ],
  templateUrl: './purchase-add.component.html',
  styleUrl: './purchase-add.component.scss',
})
export class PurchaseAddComponent {
  outletStore = inject(OutletsStore);
  supplierStore = inject(SupplierStore);
  transferStore = inject(PurchasesStore);
  notificationStore = inject(Notification);
  ngOnInit(): void {
    // this.initialize();
    this.getRequests();
  }
  initialize() {
    this.notificationStore.updateNotification({
      message: 'getting purchases',
      loading: true,
    });
    Promise.all([
      this.transferStore.getStorePurchases(
        this.outletStore.selectedStore()?._id as string,
        {},
      ),
      this.supplierStore.getStores(),
      this.outletStore.getStores(),
    ]).then((res) => {
      this.notificationStore.reset();
    });
  }
  getRequests() {
    this.transferStore
      .getStorePurchases(this.outletStore.selectedStore()?._id as string, {})
      .then((res) => console.log('done'));
  }
}
