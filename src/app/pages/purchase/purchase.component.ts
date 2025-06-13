import { Component, inject } from '@angular/core';
import { PurchasesStore } from '../../app-stores/purchases.store';
import { OutletsStore } from '../../app-stores/outlet.store';
import { PurchaseFormComponent } from '../../components/purchase-form/purchase-form.component';
import { PurchaseReceiveComponent } from '../../components/purchase-receive/purchase-receive.component';
import { PurchaseViewComponent } from '../../components/purchase-view/purchase-view.component';
import { SupplierStore } from '../../app-stores/supplier.store';

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
  ngOnInit(): void {
    // this.initialize();
    this.getRequests();
  }
  initialize() {
    Promise.all([
      this.transferStore.getStorePurchases(
        this.outletStore.selectedStore()?._id as string,
        {}
      ),
      this.supplierStore.getStores(),
      this.outletStore.getStores(),
    ]).then((res) => {
      console.log('purchase page initiliazed');
    });
  }
  getRequests() {
    this.transferStore
      .getStorePurchases(this.outletStore.selectedStore()?._id as string, {})
      .then((res) => console.log('done'));
  }
}
