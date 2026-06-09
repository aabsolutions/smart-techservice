import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TicketsService } from '../../receptionist/tickets/services/tickets.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TicketDetailDialogComponent } from './ticket-detail-dialog/ticket-detail-dialog.component';
import { SwalService } from '@core/service/swal.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatIconModule, BreadcrumbComponent, MatDialogModule, MatButtonModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  ticketsService = inject(TicketsService);
  dialog = inject(MatDialog);
  cdr = inject(ChangeDetectorRef);
  swal = inject(SwalService);

  // Columns for the Kanban board
  columns = [
    { id: 'RECIBIDO', title: 'Recibidos', tickets: [] as any[] },
    { id: 'EN DIAGNÓSTICO', title: 'En Diagnóstico', tickets: [] as any[] },
    { id: 'ESPERANDO APROBACIÓN', title: 'Esperando Aprobación', tickets: [] as any[] },
    { id: 'EN REPARACIÓN', title: 'En Reparación', tickets: [] as any[] },
    { id: 'LISTO PARA ENTREGA', title: 'Listo para Entrega', tickets: [] as any[] }
  ];

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketsService.findAll().subscribe(tickets => {
      // Reset columns
      this.columns.forEach(col => col.tickets = []);
      
      tickets.forEach(ticket => {
        const col = this.columns.find(c => c.id === ticket.status);
        if (col) {
          col.tickets.push(ticket);
        }
      });
      this.cdr.detectChanges();
    });
  }

  drop(event: CdkDragDrop<any[]>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const movedTicket = event.container.data[event.currentIndex];
      movedTicket.status = targetStatus;
      // Update status in backend
      this.updateTicketStatus(movedTicket._id, targetStatus);
    }
  }

  updateTicketStatus(ticketId: string, newStatus: string) {
    this.ticketsService.updateStatus(ticketId, newStatus, 'Movido en el tablero Kanban').subscribe({
      next: () => this.swal.success('Estado actualizado', `Movido a "${newStatus}" correctamente.`),
      error: (err) => this.swal.error('Error al actualizar estado', err.error?.message)
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTickets();
      }
    });
  }
}
