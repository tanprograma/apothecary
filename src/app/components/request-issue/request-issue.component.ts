import { Component, inject, Input } from '@angular/core';
import {
  faAngleUp,
  faAngleDown,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { OutletsStore } from '../../app-stores/outlet.store';
import { RequestAllertStore } from '../../app-stores/request-allert.store';
import { IRequest, RequestsStore } from '../../app-stores/transfers.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'request-issue',
  imports: [FontAwesomeModule],
  templateUrl: './request-issue.component.html',
  styleUrl: './request-issue.component.scss',
})
export class RequestIssueComponent {
  @Input() request!: IRequest;

  lessIcon = faAngleUp;
  moreIcon = faAngleDown;
  envelopIcon = faEnvelope;

  reqState = inject(RequestAllertStore);
  outletStore = inject(OutletsStore);
  inventoriesStore = inject(InventoriesStore);
  transferStore = inject(RequestsStore);
  showMore = false;
  toggleMore() {
    this.showMore = !this.showMore;
    this.toggleIssueCart();
    console.log(this.transferStore.issueCart());
  }
  toggleIssueCart() {
    this.showMore
      ? this.transferStore.setIssueCart(this.request.products)
      : this.transferStore.clearIssueCart();
  }
  async issue() {
    const payload = {
      _id: this.request._id,
      products: this.transferStore.issueCart().map((item) => {
        return {
          ...item,
          product: this.inventoriesStore.findProduct(item.product)._id,
        };
      }),
    };
    this.reqState.setState({
      message: 'processing issue request',
      loading: true,
    });
    const res = await this.transferStore.issueRequest(payload);
    if (!!res) {
      this.reqState.setState({
        status: true,
        message: 'successfuly issued items',
      });
    } else {
      this.reqState.setState({
        status: false,
        message: 'could not issue items',
      });
    }
  }
  updateCart(product: string, e: any) {
    // changes the received field of the item in the store
    console.log(e.target.value);
    if (!!e) {
      this.transferStore.updateIssueCartItem({
        product,
        received: parseInt(e.target.value),
      });
    }
  }
}
