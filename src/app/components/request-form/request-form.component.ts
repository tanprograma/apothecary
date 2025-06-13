import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IRequest,
  IRequestItem,
  RequestsStore,
} from '../../app-stores/transfers.store';
import {
  faAdd,
  faAngleDown,
  faAngleUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { IStore, OutletsStore } from '../../app-stores/outlet.store';
import { RequestAllertStore } from '../../app-stores/request-allert.store';
import { Product } from '../../interfaces/product';
import { CurrencyPipe } from '@angular/common';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'request-form',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    CurrencyPipe,
    CartComponent,
  ],
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.scss',
})
export class RequestFormComponent {
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
  requestStore = inject(RequestsStore);
  formBuilder = inject(FormBuilder);
  requestForm = this.formBuilder.group({
    product: ['', Validators.required],
    source: [''],
    unit: ['', Validators.required],
    requested: [0, Validators.required],
  });
  toggleCart() {
    this.showMoreItems = !this.showMoreItems;
  }
  async submitRequest() {
    // dispenses the item
    const products = this.requestStore.cart().map((item) => {
      return { ...item, product: this.findProduct(item.product)._id };
    });
    this.reqState.setState({ loading: true, message: 'submitting request' });
    const status = await this.requestStore.postRequest({
      products,
      destination: this.outletStore.selectedStore()?._id || '',
      source: this.findStore(this.requestForm.value.source ?? '')._id,

      completed: false,
    });
    console.log({ action: 'submit request', status });
    if (!!status) {
      this.reqState.setState({
        message: 'request successfully saved',
        status: true,
      });

      this.requestForm.patchValue({ source: '' });

      this.requestStore.toggleForm();
    } else {
      this.reqState.setState({
        message: 'could not save the sales',
        status: false,
      });
    }
  }
  addToCart() {
    // adds to cart

    this.requestStore.addToCart({
      product: this.requestForm.value.product ?? '',
      unit: this.requestForm.value.unit ?? '',
      price: this.getPrice(this.requestForm.value.unit ?? ''),
      unit_value: this.getUnitValue(this.requestForm.value.unit ?? ''),
      requested: this.requestForm.value.requested ?? 0,
      received: 0,
    });
    this.units = [];
    this.requestForm.patchValue({
      product: '',
      requested: 0,
      unit: '',
    });
  }
  removeFromCart(cartItem: IRequestItem) {
    this.requestStore.removeFromCart(cartItem);
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
        return item.product.name == (this.requestForm.value.product ?? '');
      })?.product?.units || []
    );
  }
  findProduct(productName: string) {
    return this.inventoriesStore.inventory().find((item) => {
      return item.product.name == productName;
    })?.product as Product;
  }
  findStore(identifier: string) {
    return this.outletStore.findStore(identifier) as IStore;
  }
  getPrices() {
    return (
      this.inventoriesStore.inventory().find((item) => {
        return item.product.name == (this.requestForm.value.product ?? '');
      })?.prices || []
    );
  }
  getValue() {
    return this.requestStore.cart().reduce((cum, curr) => {
      cum += curr.price * curr.requested;
      return cum;
    }, 0);
  }
}
