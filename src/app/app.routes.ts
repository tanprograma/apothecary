import { Routes } from '@angular/router';
// import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';
// import { LoginComponent } from './pages/login/login.component';

import { RenderMode } from '@angular/ssr';
import { ShopComponent } from './pages/shop/shop.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    loadChildren: () =>
      import('./routes/statistics.routes').then((mod) => mod.routes),
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () =>
      import('./routes/admin.routes').then((mod) => mod.routes),
  },
  {
    path: 'shop/:name/:id',
    component: ShopComponent,
    loadChildren: () =>
      import('./routes/shop.routes').then((mod) => mod.routes),
  },
];
