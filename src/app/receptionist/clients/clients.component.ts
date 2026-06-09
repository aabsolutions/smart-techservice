import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientsService, Client } from '../services/clients.service';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-receptionist-clients',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, BreadcrumbComponent],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  clientsService = inject(ClientsService);
  dialog = inject(MatDialog);
  cdr = inject(ChangeDetectorRef);
  
  clients: Client[] = [];
  displayedColumns: string[] = ['cedula', 'fullName', 'phone', 'email', 'actions'];

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientsService.getAll().subscribe((data) => {
      this.clients = data;
      this.cdr.markForCheck();
    });
  }

  openDialog(client?: Client) {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '500px',
      data: { client: client || null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadClients();
      }
    });
  }

  deactivate(id: string) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientsService.deactivate(id).subscribe(() => {
        this.loadClients();
      });
    }
  }
}
