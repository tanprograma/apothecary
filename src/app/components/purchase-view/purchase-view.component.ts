import { Component, inject, Input } from '@angular/core';

import {
  faAngleUp,
  faAngleDown,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { OutletsStore } from '../../app-stores/outlet.store';
import { IPurchase } from '../../app-stores/purchases.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupplierStore } from '../../app-stores/supplier.store';

@Component({
  selector: 'purchase-view',
  imports: [FontAwesomeModule],
  templateUrl: './purchase-view.component.html',
  styleUrl: './purchase-view.component.scss',
})
export class PurchaseViewComponent {
  @Input() request!: IPurchase;

  lessIcon = faAngleUp;
  moreIcon = faAngleDown;
  envelopIcon = faEnvelope;

  outletStore = inject(OutletsStore);
  supplierStore = inject(SupplierStore);
  showMore = false;
  toggleMore() {
    this.showMore = !this.showMore;
  }
}
