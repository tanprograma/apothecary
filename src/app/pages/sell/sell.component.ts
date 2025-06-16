import { Component, inject, OnInit } from '@angular/core';

import { OutletsStore } from '../../app-stores/outlet.store';
import { SaleFormComponent } from '../../components/sale-form/sale-form.component';
import { SaleStore } from '../../app-stores/sale.store';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'sell',
  imports: [SaleFormComponent, CurrencyPipe, FontAwesomeModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.scss',
})
export class SellComponent implements OnInit {
  showForm = false;
  plusIcon = faAdd;
  outletStore = inject(OutletsStore);
  salesStore = inject(SaleStore);
  notification = inject(Notification);
  ngOnInit(): void {
    this.getSales();
  }
  getSales() {
    this.notification.updateNotification({
      message: 'getting sales',
      loading: true,
    });
    this.salesStore
      .getStoreSales(this.outletStore.selectedStore()?._id as string, {
        limit: 5,
      })
      .then((res) => this.notification.reset());
  }
}
