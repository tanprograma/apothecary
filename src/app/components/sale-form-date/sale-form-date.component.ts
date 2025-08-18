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
import { SaleStore, ISaleItem } from '../../app-stores/sale.store';
import { Product } from '../../interfaces/product';
import { Notification } from '../../app-stores/notification.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartComponent } from '../cart/cart.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'sale-form-date',
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    CartComponent,
    CurrencyPipe,
  ],
  templateUrl: './sale-form-date.component.html',
  styleUrl: './sale-form-date.component.scss',
})
export class SaleFormDateComponent {
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
  salesStore = inject(SaleStore);
  formBuilder = inject(FormBuilder);
  saleForm = this.formBuilder.group({
    product: ['', Validators.required],
    customer: [''],
    unit: ['', Validators.required],
    quantity: [0, Validators.required],
    created_at: ['', Validators.required],
  });
  toggleCart() {
    this.showMoreItems = !this.showMoreItems;
  }
  async dispense() {
    // dispenses the item
    const products = this.salesStore.cart().map((item) => {
      return { ...item, product: this.findProduct(item.product)._id };
    });
    this.reqState.updateNotification({
      loading: true,
      message: 'submitting sales',
    });
    const status = await this.salesStore.postSale({
      products,
      store: this.outletStore.selectedStore()?._id || '',
      customer: this.saleForm.value.customer ?? '',
      createdAt: new Date(this.saleForm.value.created_at ?? '').toISOString(),
      discount: 0,
    });
    if (!!status) {
      this.reqState.updateNotification({
        message: 'sales successfully saved',
        status,
      });

      this.saleForm.patchValue({ customer: '' });

      this.salesStore.toggleSaleForm();
    } else {
      this.reqState.updateNotification({
        message: 'could not save the sales',
        status: false,
      });
    }
  }
  addToCart() {
    // adds to cart

    this.salesStore.addToCart({
      product: this.saleForm.value.product ?? '',
      unit: this.saleForm.value.unit ?? '',
      price: this.getPrice(this.saleForm.value.unit ?? ''),
      unit_value: this.getUnitValue(this.saleForm.value.unit ?? ''),
      quantity: this.saleForm.value.quantity ?? 0,
    });
    this.units = [];
    this.saleForm.patchValue({
      product: '',
      quantity: 0,
      unit: '',
    });
  }
  removeFromCart(cartItem: ISaleItem) {
    this.salesStore.removeFromCart(cartItem);
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
  setUnits() {
    // sets units in the form
    this.units = this.getUnits();
  }
  getUnits() {
    // returns units given a product
    return (
      this.inventoriesStore.inventory().find((item) => {
        return item.product.name == (this.saleForm.value.product ?? '');
      })?.product?.units || []
    );
  }
  findProduct(productName: string) {
    return this.inventoriesStore.inventory().find((item) => {
      return item.product.name == productName;
    })?.product as Product;
  }
  getPrices() {
    return (
      this.inventoriesStore.inventory().find((item) => {
        return item.product.name == (this.saleForm.value.product ?? '');
      })?.prices || []
    );
  }
  getValue() {
    return this.salesStore.cart().reduce((cum, curr) => {
      cum += curr.price * curr.quantity;
      return cum;
    }, 0);
  }
}
