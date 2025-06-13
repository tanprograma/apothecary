import { Routes } from '@angular/router';
import { SalesStatisticsComponent } from '../pages/sales-statistics/sales-statistics.component';
import { InventoryStatisticsComponent } from '../pages/inventory-statistics/inventory-statistics.component';
import { PurchasesStatisticsComponent } from '../pages/purchases-statistics/purchases-statistics.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home/sales-statistics' },
  { path: 'sales-statistics', component: SalesStatisticsComponent },
  { path: 'purchases-statistics', component: PurchasesStatisticsComponent },
  { path: 'inventory-statistics', component: InventoryStatisticsComponent },
];
