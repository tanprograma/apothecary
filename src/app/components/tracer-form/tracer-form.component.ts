import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  faAdd,
  faAngleDown,
  faAngleUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { OutletsStore } from '../../app-stores/outlet.store';
import { Notification } from '../../app-stores/notification.store';
import { Product } from '../../interfaces/product';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'tracer-form',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './tracer-form.component.html',
  styleUrl: './tracer-form.component.scss',
})
export class TracerFormComponent {
  plusIcon = faAdd;
  angleDown = faAngleDown;
  angleUp = faAngleUp;
  crossIcon = faTimes;
  showMoreItems = true;

  units: { name: string; value: number }[] = [];

  inventoriesStore = inject(InventoriesStore);
  // for state management of the request
  reqState = inject(Notification);
  outletStore = inject(OutletsStore);
  // tracersStore = inject(TracersStore);

  formBuilder = inject(FormBuilder);
  tracerForm = this.formBuilder.group({
    product: ['', Validators.required],

    unit: ['', Validators.required],
    quantity: [0, Validators.required],
    created_on: ['', Validators.required],
  });
  toggleCart() {
    this.showMoreItems = !this.showMoreItems;
  }
  async setTracer() {
    // dispenses the item

    const product = this.findProduct(this.tracerForm.value.product ?? '')._id;
    const store = this.outletStore.selectedStore()?._id || '';
    const status = await this.inventoriesStore.postTracer({
      created_on: new Date(
        this.tracerForm.value.created_on ?? ''
      ).toISOString(),
      value:
        (this.tracerForm.value.quantity || 0) *
        this.getUnitValue(this.tracerForm.value.unit ?? ''),
      store,
      product,
    });
    if (!!status) {
      this.reqState.updateNotification({
        message: 'tracer successfully saved',
        status,
      });

      this.tracerForm.patchValue({
        product: '',

        quantity: 0,
        unit: '',
      });
    } else {
      this.reqState.updateNotification({
        message: 'could not save the tracer',
        status: false,
      });
    }
  }

  getUnitValue(unit: string) {
    // given unit name, returns its value based
    return (
      this.getUnits().find((item) => {
        return item.name == unit;
      })?.value || 1
    );
  }

  setUnits() {
    // sets units in the form
    this.units = this.getUnits();
  }
  getUnits() {
    // returns units given a product
    return (
      this.inventoriesStore.inventory().find((item) => {
        return item.product.name == (this.tracerForm.value.product ?? '');
      })?.product?.units || []
    );
  }
  findProduct(productName: string) {
    return this.inventoriesStore.inventory().find((item) => {
      return item.product.name == productName;
    })?.product as Product;
  }
}
