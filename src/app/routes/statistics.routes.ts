import { Routes } from '@angular/router';
import { SalesStatisticsComponent } from '../pages/sales-statistics/sales-statistics.component';
import { InventoryStatisticsComponent } from '../pages/inventory-statistics/inventory-statistics.component';
import { PurchasesStatisticsComponent } from '../pages/purchases-statistics/purchases-statistics.component';
import { SalestatDetailedComponent } from '../pages/salestat-detailed/salestat-detailed.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/statistics/sales' },
  { path: 'sales', component: SalesStatisticsComponent },
  { path: 'sales-detailed', component: SalestatDetailedComponent },
  { path: 'purchases', component: PurchasesStatisticsComponent },
  { path: 'inventories', component: InventoryStatisticsComponent },
];
