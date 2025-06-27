import { Component, inject } from '@angular/core';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { OutletsStore } from '../../app-stores/outlet.store';
import { SaleStore } from '../../app-stores/sale.store';
import { Notification } from '../../app-stores/notification.store';
import { CurrencyPipe } from '@angular/common';
import { SaleFormDateComponent } from '../../components/sale-form-date/sale-form-date.component';

@Component({
  selector: 'sell-backdate',
  imports: [CurrencyPipe, SaleFormDateComponent],
  templateUrl: './sell-backdate.component.html',
  styleUrl: './sell-backdate.component.scss',
})
export class SellBackdateComponent {
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
