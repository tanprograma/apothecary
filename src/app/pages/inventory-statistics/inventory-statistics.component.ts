import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { InventoriesStore } from '../../app-stores/inventory.store';
import { Notification } from '../../app-stores/notification.store';

@Component({
  selector: 'inventory-statistics',
  imports: [FontAwesomeModule, CurrencyPipe],
  templateUrl: './inventory-statistics.component.html',
  styleUrl: './inventory-statistics.component.scss',
})
export class InventoryStatisticsComponent {
  itemIcon = faGem;
  notificationStore = inject(Notification);
  ngOnInit(): void {
    this.getSummary({});
  }
  inventoryStore = inject(InventoriesStore);

  getSummary(options: any) {
    this.notificationStore.updateNotification({
      message: 'initializing statistics',
      loading: true,
    });
    this.inventoryStore
      .getInventorySummary(options)
      .then(() => this.notificationStore.reset());
  }
}
