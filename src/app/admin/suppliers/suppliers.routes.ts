import { Route } from '@angular/router';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';

export const SUPPLIERS_ROUTE: Route[] = [
  {
    path: '',
    component: SuppliersListComponent,
  },
];
