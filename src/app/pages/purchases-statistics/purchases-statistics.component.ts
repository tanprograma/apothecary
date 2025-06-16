import { Component, inject } from '@angular/core';
import { PurchasesStore } from '../../app-stores/purchases.store';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe } from '@angular/common';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'purchases-statistics',
  imports: [FontAwesomeModule, CurrencyPipe],
  templateUrl: './purchases-statistics.component.html',
  styleUrl: './purchases-statistics.component.scss',
})
export class PurchasesStatisticsComponent {
  itemIcon = faGem;
  notificationStore = inject(Notification);
  ngOnInit(): void {
    this.getSummary({});
  }
  purchasesStore = inject(PurchasesStore);

  getSummary(options: any) {
    this.notificationStore.updateNotification({
      message: 'getting purchase statistics',
      loading: true,
    });
    this.purchasesStore
      .getPurchasesSummary(options)
      .then(() => this.notificationStore.reset());
  }
}
