import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';

export const SUPERADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.SuperAdminDashboardComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/users.component').then((m) => m.UsersManagementComponent),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./roles/roles.component').then((m) => m.RolesManagementComponent),
  },
  {
    path: 'audit-log',
    loadComponent: () =>
      import('./audit-log/audit-log.component').then((m) => m.AuditLogComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', component: Page404Component },
];
