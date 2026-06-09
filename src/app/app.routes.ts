import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
import { Role } from '@core';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
      {
        path: 'superadmin',
        canActivate: [AuthGuard],
        data: { role: Role.SuperAdmin },
        loadChildren: () =>
          import('./superadmin/superadmin.routes').then((m) => m.SUPERADMIN_ROUTE),
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { role: Role.Admin },
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.ADMIN_ROUTE),
      },
      {
        path: 'technician',
        canActivate: [AuthGuard],
        data: { role: Role.Technician },
        loadChildren: () =>
          import('./technician/technician.routes').then((m) => m.TECHNICIAN_ROUTE),
      },
      {
        path: 'receptionist',
        canActivate: [AuthGuard],
        data: { role: Role.Receptionist },
        loadChildren: () =>
          import('./receptionist/receptionist.routes').then((m) => m.RECEPTIONIST_ROUTE),
      },
      {
        path: 'client-portal',
        canActivate: [AuthGuard],
        data: { role: Role.Client },
        loadChildren: () =>
          import('./client-portal/client-portal.routes').then((m) => m.CLIENT_PORTAL_ROUTE),
      },
      {
        path: 'extra-pages',
        loadChildren: () =>
          import('./extra-pages/extra-pages.routes').then(
            (m) => m.EXTRA_PAGES_ROUTE,
          ),
      },
      {
        path: 'multilevel',
        loadChildren: () =>
          import('./multilevel/multilevel.routes').then(
            (m) => m.MULTILEVEL_ROUTE,
          ),
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },
  { path: '**', component: Page404Component },
];
