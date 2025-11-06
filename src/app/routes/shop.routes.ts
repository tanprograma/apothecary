import { Routes } from '@angular/router';
import { RequestComponent } from '../pages/request/request.component';
import { SellComponent } from '../pages/sell/sell.component';
import { PurchaseComponent } from '../pages/purchase/purchase.component';
import { ManageInventoryComponent } from '../pages/manage-inventory/manage-inventory.component';
import { ExpiryComponent } from '../pages/expiry/expiry.component';
import { SellBackdateComponent } from '../pages/sell-backdate/sell-backdate.component';
import { TracersComponent } from '../pages/tracers/tracers.component';

export const routes: Routes = [
  {
    path: '',
    component: SellComponent,
  },
  { path: 'sell', component: SellComponent },
  { path: 'sell-backdate', component: SellBackdateComponent },
  { path: 'request', component: RequestComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'expiry', component: ExpiryComponent },
  { path: 'tracers', component: TracersComponent },
  { path: 'manage-inventory', component: ManageInventoryComponent },
];
