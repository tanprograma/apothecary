import { Routes } from '@angular/router';
import { LogsComponent } from '../pages/logs/logs.component';
import { ProductsComponent } from '../pages/products/products.component';
import { UnitsComponent } from '../pages/units/units.component';
import { StoresComponent } from '../pages/stores/stores.component';
import { SuppliersComponent } from '../pages/suppliers/suppliers.component';
import { UsersComponent } from '../pages/users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: '/admin/logs', pathMatch: 'full' },
  { path: 'logs', component: LogsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'units', component: UnitsComponent },

  { path: 'stores', component: StoresComponent },
  { path: 'suppliers', component: SuppliersComponent },
  { path: 'users', component: UsersComponent },
];
