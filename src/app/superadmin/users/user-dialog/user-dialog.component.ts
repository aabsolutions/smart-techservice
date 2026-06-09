import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UsersManagementService } from '../../services/users.service';
import { RolesManagementService } from '../../services/roles.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SwalService } from '@core/service/swal.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './user-dialog.component.html',
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  isEdit = false;
  roles: any[] = [];
  
  usersService = inject(UsersManagementService);
  rolesService = inject(RolesManagementService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  swal = inject(SwalService);

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data?.user;
    this.userForm = this.fb.group({
      username: [data?.user?.username || '', Validators.required],
      email: [data?.user?.email || '', [Validators.email]],
      fullName: [data?.user?.fullName || '', Validators.required],
      password: [''],
      roles: [data?.user?.roles?.map((r: any) => r.name) || ['CLIENT'], Validators.required]
    });

    if (!this.isEdit) {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
  }

  ngOnInit() {
    this.rolesService.getAll().subscribe(roles => {
      this.roles = roles;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const val = { ...this.userForm.value };
      if (val.email) val.email = val.email.trim();
      if (!val.email) delete val.email;
      if (this.isEdit) {
        if (!val.password) delete val.password;
        this.usersService.update(this.data.user._id, val).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            this.swal.error('Error al actualizar', err.error?.message || err.message);
          }
        });
      } else {
        this.usersService.create(val).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            this.swal.error('Error al crear usuario', err.error?.message || err.message);
          }
        });
      }
    }
  }
}
