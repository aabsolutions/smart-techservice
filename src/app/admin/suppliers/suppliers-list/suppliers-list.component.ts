import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { SuppliersService, Supplier } from '../services/suppliers.service';
import { SuppliersFormComponent } from '../suppliers-form/suppliers-form.component';
import { SwalService } from '@core/service/swal.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, BreadcrumbComponent],
  templateUrl: './suppliers-list.component.html'
})
export class SuppliersListComponent implements OnInit {
  suppliersService = inject(SuppliersService);
  dialog = inject(MatDialog);
  swal = inject(SwalService);

  suppliers: Supplier[] = [];
  displayedColumns: string[] = ['ruc', 'name', 'contactPerson', 'phone', 'status', 'actions'];

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.suppliersService.findAll().subscribe({
      next: (data) => this.suppliers = data,
      error: (err) => this.swal.error('Error', 'No se pudieron cargar los proveedores')
    });
  }

  openForm(supplier?: Supplier) {
    const dialogRef = this.dialog.open(SuppliersFormComponent, {
      width: '600px',
      data: { supplier }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  deleteSupplier(supplier: Supplier) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Proveedor',
        message: `¿Estás seguro de eliminar el proveedor ${supplier.name}?`,
        confirmText: 'Sí, eliminar',
        icon: 'warning',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && supplier._id) {
        this.suppliersService.remove(supplier._id).subscribe({
          next: () => {
            this.swal.success('Eliminado', 'El proveedor fue eliminado');
            this.loadSuppliers();
          },
          error: () => this.swal.error('Error', 'No se pudo eliminar el proveedor')
        });
      }
    });
  }
}
