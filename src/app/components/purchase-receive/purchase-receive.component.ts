import { Component, inject, Input } from '@angular/core';
import { IPurchase, PurchasesStore } from '../../app-stores/purchases.store';
import { SupplierStore } from '../../app-stores/supplier.store';
import {
  faAngleDown,
  faAngleUp,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

import { OutletsStore } from '../../app-stores/outlet.store';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'purchase-receive',
  imports: [FontAwesomeModule],
  templateUrl: './purchase-receive.component.html',
  styleUrl: './purchase-receive.component.scss',
})
export class PurchaseReceiveComponent {
  @Input() request!: IPurchase;

  lessIcon = faAngleUp;
  moreIcon = faAngleDown;
  envelopIcon = faEnvelope;

  reqState = inject(Notification);
  outletStore = inject(OutletsStore);
  supplierStore = inject(SupplierStore);
  inventoriesStore = inject(InventoriesStore);
  transferStore = inject(PurchasesStore);
  showMore = false;
  toggleMore() {
    this.showMore = !this.showMore;
    this.toggleIssueCart();
    console.log(this.transferStore.receiveCart());
  }
  toggleIssueCart() {
    this.showMore
      ? this.transferStore.setReceiveCart(this.request.products)
      : this.transferStore.clearReceiveCart();
  }
  async receive() {
    const payload = {
      _id: this.request._id,
      products: this.transferStore.receiveCart().map((item) => {
        return {
          ...item,
          product: this.inventoriesStore.findProduct(item.product)._id,
        };
      }),
    };
    this.reqState.updateNotification({
      message: 'processing issue request',
      loading: true,
    });
    const res = await this.transferStore.receivePurchase(payload);
    if (!!res) {
      this.reqState.updateNotification({
        status: true,
        message: 'successfuly issued items',
      });
    } else {
      this.reqState.updateNotification({
        status: false,
        message: 'could not issue items',
      });
    }
  }
  updateCart(product: string, e: any) {
    // changes the received field of the item in the store
    console.log(e.target.value);
    if (!!e) {
      this.transferStore.updateReceiveCartItem({
        product,
        received: parseInt(e.target.value),
      });
    }
  }
}
