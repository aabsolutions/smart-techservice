import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TicketsService } from '../services/tickets.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TicketDetailDialogComponent } from '../../../technician/board/ticket-detail-dialog/ticket-detail-dialog.component';
import { AuthService } from '@core/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatTooltipModule, RouterModule, BreadcrumbComponent],
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})
export class TicketsListComponent implements OnInit {
  ticketsService = inject(TicketsService);
  authService = inject(AuthService);
  dialog = inject(MatDialog);
  cdr = inject(ChangeDetectorRef);
  tickets: any[] = [];
  displayedColumns: string[] = ['ticketNumber', 'physicalOrder', 'client', 'technician', 'status', 'createdAt', 'actions'];
  isAdmin: boolean = false;

  constructor() {
    this.isAdmin = this.authService.isSuperAdmin() || this.authService.hasRole('ADMIN');
  }

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketsService.findAll().subscribe({
      next: (data) => {
        this.tickets = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  getShortId(id: any): string {
    if (!id) return 'N/A';
    return id.toString().slice(-6).toUpperCase();
  }

  openDetail(ticket: any) {
    const dialogRef = this.dialog.open(TicketDetailDialogComponent, {
      width: '600px',
      data: { ticket }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadTickets();
    });
  }

  deleteTicket(ticket: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará todo el registro y el historial de este ticket. No se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar ticket'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ticketsService.remove(ticket._id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El ticket ha sido eliminado correctamente.', 'success');
            this.loadTickets();
          },
          error: (err) => Swal.fire('Error', 'No se pudo eliminar el ticket.', 'error')
        });
      }
    });
  }
}
