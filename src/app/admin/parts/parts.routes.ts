import { Route } from '@angular/router';
import { PartsListComponent } from './parts-list/parts-list.component';

export const PARTS_ROUTE: Route[] = [
  {
    path: '',
    component: PartsListComponent,
  },
];
