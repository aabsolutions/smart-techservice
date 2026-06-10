import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SuppliersService, Supplier } from '../services/suppliers.service';
import { SwalService } from '@core/service/swal.service';

@Component({
  selector: 'app-suppliers-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './suppliers-form.component.html'
})
export class SuppliersFormComponent implements OnInit {
  suppliersService = inject(SuppliersService);
  swal = inject(SwalService);
  fb = inject(FormBuilder);

  supplierForm: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<SuppliersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { supplier?: Supplier }
  ) {
    this.isEdit = !!data?.supplier;
    this.supplierForm = this.fb.group({
      ruc: [data?.supplier?.ruc || '', [Validators.required]],
      name: [data?.supplier?.name || '', [Validators.required]],
      contactPerson: [data?.supplier?.contactPerson || ''],
      email: [data?.supplier?.email || '', [Validators.email]],
      phone: [data?.supplier?.phone || ''],
      address: [data?.supplier?.address || ''],
      isActive: [data?.supplier?.isActive ?? true]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.supplierForm.invalid) return;

    const supplierData = this.supplierForm.value;

    if (this.isEdit && this.data.supplier?._id) {
      this.suppliersService.update(this.data.supplier._id, supplierData).subscribe({
        next: () => {
          this.swal.success('Actualizado', 'El proveedor ha sido actualizado');
          this.dialogRef.close(true);
        },
        error: (err) => this.swal.error('Error', err.error?.message || 'No se pudo actualizar')
      });
    } else {
      this.suppliersService.create(supplierData).subscribe({
        next: () => {
          this.swal.success('Creado', 'El proveedor ha sido creado');
          this.dialogRef.close(true);
        },
        error: (err) => this.swal.error('Error', err.error?.message || 'No se pudo crear')
      });
    }
  }
}
