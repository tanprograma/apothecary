import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAdd,
  faAngleDown,
  faAngleUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { CurrencyPipe } from '@angular/common';
import { CartComponent } from '../cart/cart.component';
import { Product } from '../../interfaces/product';
import { OutletsStore } from '../../app-stores/outlet.store';

import { RequestAllertStore } from '../../app-stores/request-allert.store';
import { ISaleItem, SaleStore, ISale } from '../../app-stores/sale.store';

@Component({
  selector: 'sale-form',
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    CurrencyPipe,
    CartComponent,
  ],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.scss',
})
export class SaleFormComponent {
  plusIcon = faAdd;
  angleDown = faAngleDown;
  angleUp = faAngleUp;
  crossIcon = faTimes;
  showMoreItems = true;

  units: { name: string; value: number }[] = [];

  inventoriesStore = inject(InventoriesStore);
  // for state management of the request
  reqState = inject(RequestAllertStore);
  outletStore = inject(OutletsStore);
  salesStore = inject(SaleStore);
  formBuilder = inject(FormBuilder);
  saleForm = this.formBuilder.group({
    product: ['', Validators.required],
    customer: [''],
    unit: ['', Validators.required],
    quantity: [0, Validators.required],
  });
  toggleCart() {
    this.showMoreItems = !this.showMoreItems;
  }
  async dispense() {
    // dispenses the item
    const products = this.salesStore.cart().map((item) => {
      return { ...item, product: this.findProduct(item.product)._id };
    });
    this.reqState.setState({ loading: true, message: 'submitting sales' });
    const status = await this.salesStore.postSale({
      products,
      store: this.outletStore.selectedStore()?._id || '',
      customer: this.saleForm.value.customer ?? '',
      discount: 0,
    });
    if (!!status) {
      this.reqState.setState({
        message: 'sales successfully saved',
        status,
      });

      this.saleForm.patchValue({ customer: '' });

      this.salesStore.toggleSaleForm();
    } else {
      this.reqState.setState({
        message: 'could not save the sales',
        status: false,
      });
    }
  }
  addToCart() {
    // adds to cart
    {
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
