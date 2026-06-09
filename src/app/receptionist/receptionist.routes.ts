import { Page404Component } from '../authentication/page404/page404.component';
import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientsComponent } from './clients/clients.component';
import { TicketsListComponent } from './tickets/tickets-list/tickets-list.component';
import { TicketCreateComponent } from './tickets/ticket-create/ticket-create.component';

export const RECEPTIONIST_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'clients',
    component: ClientsComponent,
  },
  {
    path: 'tickets',
    component: TicketsListComponent,
  },
  {
    path: 'tickets/create',
    component: TicketCreateComponent,
  },
  { path: '**', component: Page404Component },
];
