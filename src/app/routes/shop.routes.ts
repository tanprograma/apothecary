import { Routes } from '@angular/router';
import { RequestComponent } from '../pages/request/request.component';
import { SellComponent } from '../pages/sell/sell.component';
import { PurchaseComponent } from '../pages/purchase/purchase.component';
import { ManageInventoryComponent } from '../pages/manage-inventory/manage-inventory.component';
import { ExpiryComponent } from '../pages/expiry/expiry.component';

export const routes: Routes = [
  {
    path: '',
    component: SellComponent,
  },
  { path: 'sell', component: SellComponent },
  { path: 'request', component: RequestComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'expiry', component: ExpiryComponent },
  { path: 'manage-inventory', component: ManageInventoryComponent },
];
