import { Component, inject } from '@angular/core';
import { PurchasesStore } from '../../app-stores/purchases.store';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'purchases-statistics',
  imports: [FontAwesomeModule, CurrencyPipe],
  templateUrl: './purchases-statistics.component.html',
  styleUrl: './purchases-statistics.component.scss',
})
export class PurchasesStatisticsComponent {
  itemIcon = faGem;

  ngOnInit(): void {
    this.getSummary({});
  }
  purchasesStore = inject(PurchasesStore);
  getSummary(options: any) {
    this.purchasesStore.getPurchasesSummary(options).then(() => {});
  }
}
