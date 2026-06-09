import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RolesManagementService } from '../../services/roles.service';
import { SwalService } from '@core/service/swal.service';

@Component({
  selector: 'app-role-permissions-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule],
  templateUrl: './role-permissions-dialog.component.html',
})
export class RolePermissionsDialogComponent implements OnInit {
  rolesService = inject(RolesManagementService);
  cdr = inject(ChangeDetectorRef);
  swal = inject(SwalService);

  allPermissions: any[] = [];
  selectedPermissions: Set<string> = new Set();

  constructor(
    public dialogRef: MatDialogRef<RolePermissionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: any }
  ) {
    if (this.data.role?.permissions) {
      this.data.role.permissions.forEach((p: string) => this.selectedPermissions.add(p));
    }
  }

  ngOnInit() {
    this.rolesService.getAllPermissions().subscribe(perms => {
      this.allPermissions = perms;
      this.cdr.detectChanges();
    });
  }

  togglePermission(permName: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedPermissions.add(permName);
    } else {
      this.selectedPermissions.delete(permName);
    }
  }

  hasPermission(permName: string): boolean {
    return this.selectedPermissions.has(permName);
  }

  save() {
    const permsArray = Array.from(this.selectedPermissions);
    this.rolesService.update(this.data.role._id, { permissions: permsArray }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.swal.error('Error al guardar permisos', err.error?.message || 'Intente de nuevo.');
      }
    });
  }
}
