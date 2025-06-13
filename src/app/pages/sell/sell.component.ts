import { Component, inject, OnInit } from '@angular/core';

import { OutletsStore } from '../../app-stores/outlet.store';
import { SaleFormComponent } from '../../components/sale-form/sale-form.component';
import { SaleStore } from '../../app-stores/sale.store';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

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
  ngOnInit(): void {
    this.getSales();
  }
  getSales() {
    this.salesStore
      .getStoreSales(this.outletStore.selectedStore()?._id as string, {
        limit: 5,
      })
      .then((res) => console.log('done'));
  }
}
