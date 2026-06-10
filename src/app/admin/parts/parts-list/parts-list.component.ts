import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PartsService, Part } from '../services/parts.service';
import { PartsFormComponent } from '../parts-form/parts-form.component';
import { SwalService } from '@core/service/swal.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, BreadcrumbComponent],
  templateUrl: './parts-list.component.html'
})
export class PartsListComponent implements OnInit {
  partsService = inject(PartsService);
  dialog = inject(MatDialog);
  swal = inject(SwalService);

  parts: Part[] = [];
  displayedColumns: string[] = ['code', 'name', 'price', 'stock', 'status', 'actions'];

  ngOnInit() {
    this.loadParts();
  }

  loadParts() {
    this.partsService.findAll().subscribe({
      next: (data) => this.parts = data,
      error: (err) => this.swal.error('Error', 'No se pudieron cargar las piezas')
    });
  }

  openForm(part?: Part) {
    const dialogRef = this.dialog.open(PartsFormComponent, {
      width: '600px',
      data: { part }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadParts();
      }
    });
  }

  deletePart(part: Part) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Pieza',
        message: `¿Estás seguro de eliminar la pieza ${part.name}?`,
        confirmText: 'Sí, eliminar',
        icon: 'warning',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && part._id) {
        this.partsService.remove(part._id).subscribe({
          next: () => {
            this.swal.success('Eliminado', 'La pieza fue eliminada');
            this.loadParts();
          },
          error: () => this.swal.error('Error', 'No se pudo eliminar la pieza')
        });
      }
    });
  }
}
