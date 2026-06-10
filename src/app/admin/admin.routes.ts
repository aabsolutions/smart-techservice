import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
  },
  {
    path: 'parts',
    loadChildren: () =>
      import('./parts/parts.routes').then((m) => m.PARTS_ROUTE),
  },
  {
    path: 'suppliers',
    loadChildren: () =>
      import('./suppliers/suppliers.routes').then((m) => m.SUPPLIERS_ROUTE),
  },
  { path: '**', component: Page404Component },
];
