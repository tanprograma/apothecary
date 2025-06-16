import { Component, inject, OnInit } from '@angular/core';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGem, faInfo } from '@fortawesome/free-solid-svg-icons';
import { SaleStore } from '../../app-stores/sale.store';
import { CurrencyPipe } from '@angular/common';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'sales-statistics',
  imports: [FontAwesomeModule, CurrencyPipe],
  templateUrl: './sales-statistics.component.html',
  styleUrl: './sales-statistics.component.scss',
})
export class SalesStatisticsComponent implements OnInit {
  inventoryIcon = faGem;
  notification = inject(Notification);
  ngOnInit(): void {
    this.getSummary({});
  }
  salesStore = inject(SaleStore);
  getSummary(options: any) {
    this.notification.updateNotification({
      message: 'getting statistics',
      loading: true,
    });
    this.salesStore
      .getSalesSummary(options)
      .then(() => this.notification.reset());
  }
}
