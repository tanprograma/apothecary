import { Component, inject } from '@angular/core';
import { PurchasesStore } from '../../app-stores/purchases.store';
import { OutletsStore } from '../../app-stores/outlet.store';
import { PurchaseFormComponent } from '../../components/purchase-form/purchase-form.component';
import { PurchaseReceiveComponent } from '../../components/purchase-receive/purchase-receive.component';
import { PurchaseViewComponent } from '../../components/purchase-view/purchase-view.component';
import { SupplierStore } from '../../app-stores/supplier.store';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'purchase',
  imports: [
    PurchaseFormComponent,
    PurchaseReceiveComponent,
    PurchaseViewComponent,
  ],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent {
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
        {}
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
