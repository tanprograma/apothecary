import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { OutletsStore } from '../../app-stores/outlet.store';
import { SaleStore } from '../../app-stores/sale.store';
import { Notification } from '../../app-stores/notification.store';
import { CurrencyPipe } from '@angular/common';
import {
  RequestQuery,
  StatisticsFilterComponent,
} from '../../components/statistics-filter/statistics-filter.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';

@Component({
  selector: 'salestat-detailed',
  imports: [
    FontAwesomeModule,
    CurrencyPipe,
    StatisticsFilterComponent,
    SearchBoxComponent,
  ],
  templateUrl: './salestat-detailed.component.html',
  styleUrl: './salestat-detailed.component.scss',
})
export class SalestatDetailedComponent {
  showForm = false;
  plusIcon = faAdd;
  outletStore = inject(OutletsStore);
  salesStore = inject(SaleStore);
  notification = inject(Notification);
  ngOnInit(): void {
    this.getSales();
  }
  getSales() {
    console.log('running detailed sales report');
    this.notification.updateNotification({
      message: 'getting sales',
      loading: true,
    });
    this.salesStore
      .getStoreReport({
        limit: 20,
      })
      .then((res) => this.notification.reset());
  }
  async filterSales(query: RequestQuery) {
    this.notification.updateNotification({
      message: 'filtering sales',
      loading: true,
    });

    await this.salesStore.getStoreReport(query);

    this.notification.reset();
  }
  async reset() {
    this.notification.updateNotification({
      message: 'filtering sales',
      loading: true,
    });
    await this.salesStore.getStoreReport({ limit: 20 });
    this.salesStore.updateFilter({ product: '' });
    this.notification.reset();
  }
  search(item: string) {
    this.salesStore.updateFilter({ product: item });
  }
}
