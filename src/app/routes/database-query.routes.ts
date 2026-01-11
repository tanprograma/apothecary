import { Routes } from '@angular/router';
import { QueryInventoryComponent } from '../pages/query-inventory/query-inventory.component';
import { QuerySalesComponent } from '../pages/query-sales/query-sales.component';
import { QueryRequestsComponent } from '../pages/query-requests/query-requests.component';
import { QueryPurchasesComponent } from '../pages/query-purchases/query-purchases.component';

export const DATABASE_QUERY_ROUTES: Routes = [
  {
    path: '',

    children: [
      { path: 'inventory-query', component: QueryInventoryComponent },
      { path: 'sales-query', component: QuerySalesComponent },
      { path: 'requests-query', component: QueryRequestsComponent },
      { path: 'purchases-query', component: QueryPurchasesComponent },
      { path: '', redirectTo: 'inventory-query', pathMatch: 'full' },
    ],
  },
];
