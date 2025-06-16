import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { OutletsStore } from '../../app-stores/outlet.store';
import { Expiry, ExpiryStore } from '../../app-stores/expiry.store';
import { InventoriesStore } from '../../app-stores/inventory.store';
import {
  faAdd,
  faAngleDown,
  faAngleUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../interfaces/product';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'expiry-form',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './expiry-form.component.html',
  styleUrl: './expiry-form.component.scss',
})
export class ExpiryFormComponent {
  plusIcon = faAdd;
  angleDown = faAngleDown;
  angleUp = faAngleUp;
  crossIcon = faTimes;
  showMoreItems = true;

  units: { name: string; value: number }[] = [];
  notificationService = inject(Notification);
  inventoriesStore = inject(InventoriesStore);
  expiryStore = inject(ExpiryStore);
  // for state management of the request

  outletStore = inject(OutletsStore);

  formBuilder = inject(FormBuilder);
  saleForm = this.formBuilder.group({
    product: ['', Validators.required],
    expiry: ['', Validators.required],

    unit: ['', Validators.required],
    quantity: [0, Validators.required],
  });
  async addExpiry() {
    this.notificationService.updateNotification({ message: 'posting expiry' });
    const payload = this.getPayload();
    const product = this.inventoriesStore.findProduct(payload.product)._id;
    const store = this.outletStore.selectedStore();
    const newPayload = { ...payload, product: product, store: store?._id };
    const status = await this.expiryStore.postExpiry(newPayload, {
      ...payload,
      store: store?.name,
    });
    if (!!status) {
      this.notificationService.updateNotification({
        status: true,
        message: 'successfuly added to expiry',
      });
      this.clearForm();
    } else {
      this.notificationService.updateNotification({
        status: false,
        message: 'could not add to expiry',
      });
    }
  }
  clearForm() {
    this.saleForm.reset();
  }
  setUnits() {
    this.units = this.getUnits();
  }
  getUnits() {
    return (
      this.inventoriesStore.inventory().find((item) => {
        return item.product.name == (this.saleForm.value.product ?? '');
      })?.product?.units || []
    );
  }
  getUnitValue(unit: string) {
    // given unit name, returns its value based
    return (
      this.getUnits().find((item) => {
        return item.name == unit;
      })?.value || 1
    );
  }
  getPrice(unit: string) {
    // given a unit name, return its price
    return (
      this.getPrices().find((item) => {
        return item.unit == unit;
      })?.value || 1
    );
  }
  getPrices() {
    return (
      this.inventoriesStore.inventory().find((item) => {
        return item.product.name == (this.saleForm.value.product ?? '');
      })?.prices || []
    );
  }
  findProduct(productName: string) {
    return this.inventoriesStore.inventory().find((item) => {
      return item.product.name == productName;
    })?.product as Product;
  }
  // async dispense() {
  //   // dispenses the item
  //   // const payload=this.getPayload()
  //   // const product =this.findProduct(payload.product as string)._id };
  //   // this.reqState.setState({ loading: true, message: 'submitting sales' });
  //   // const status = await this.expiryStore.postSale({
  //   //   products,
  //   //   store: this.outletStore.selectedStore()?._id || '',
  //   //   customer: this.saleForm.value.customer ?? '',
  //   //   discount: 0,
  //   // });
  //   // if (!!status) {
  //   //   this.reqState.updateNotification({
  //   //     message: 'sales successfully saved',
  //   //     status,
  //   //   });
  //   // } else {
  //   //   this.reqState.updateNotification({
  //   //     message: 'could not save the sales',
  //   //     status: false,
  //   //   });
  //   // }
  // }
  getPayload() {
    return {
      product: this.saleForm.value.product ?? '',
      expiry: this.saleForm.value.expiry ?? '',
      unit: this.saleForm.value.unit ?? '',
      price: this.getPrice(this.saleForm.value.unit ?? ''),
      unit_value: this.getUnitValue(this.saleForm.value.unit ?? ''),
      quantity: this.saleForm.value.quantity ?? 0,
    };
  }
}
