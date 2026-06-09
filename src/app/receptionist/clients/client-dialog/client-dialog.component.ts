import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ClientsService } from '../../services/clients.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SwalService } from '@core/service/swal.service';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './client-dialog.component.html',
})
export class ClientDialogComponent implements OnInit {
  clientForm: FormGroup;
  isEdit = false;
  
  clientsService = inject(ClientsService);
  fb = inject(FormBuilder);
  swal = inject(SwalService);

  constructor(
    public dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data?.client;
    this.clientForm = this.fb.group({
      cedula: [data?.client?.cedula || '', Validators.required],
      fullName: [data?.client?.fullName || '', Validators.required],
      phone: [data?.client?.phone || '', Validators.required],
      email: [data?.client?.email || '', [Validators.email]],
      address: [data?.client?.address || '']
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.clientForm.valid) {
      const val = { ...this.clientForm.value };
      if (val.email) val.email = val.email.trim();
      if (!val.email) delete val.email;
      if (this.isEdit) {
        this.clientsService.update(this.data.client._id, val).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            this.swal.error('Error al actualizar', err.error?.message || err.message);
          }
        });
      } else {
        this.clientsService.create(val).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            this.swal.error('Error al crear cliente', err.error?.message || err.message);
          }
        });
      }
    }
  }
}
